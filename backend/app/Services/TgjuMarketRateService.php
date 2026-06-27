<?php

namespace App\Services;

use App\Models\MarketRateInstrument;
use App\Models\MarketRateSnapshot;
use App\Models\MarketRateSource;
use App\Models\MarketRateSyncLog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class TgjuMarketRateService
{
    private const SOURCE_KEY = 'tgju';
    private const SOURCE_NAME = 'internal_market_rate_source';

    private const DEFINITIONS = [
        ['key' => 'price_dollar_rl', 'title' => 'دلار بازار', 'symbol' => 'USD', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 10],
        ['key' => 'price_eur', 'title' => 'یورو بازار', 'symbol' => 'EUR', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 20],
        ['key' => 'price_aed', 'title' => 'درهم بازار', 'symbol' => 'AED', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 30],
        ['key' => 'price_cny', 'title' => 'یوان بازار', 'symbol' => 'CNY', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 40],
        ['key' => 'price_try', 'title' => 'لیر بازار', 'symbol' => 'TRY', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 50],
        ['key' => 'price_rub', 'title' => 'روبل بازار', 'symbol' => 'RUB', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 60],
        ['key' => 'price_iqd', 'title' => 'دینار عراق بازار', 'symbol' => 'IQD', 'unit' => 'ریال', 'group' => 'market', 'sort_order' => 70],
        ['key' => 'geram18', 'title' => 'طلای ۱۸ عیار', 'symbol' => '18K', 'unit' => 'ریال', 'group' => 'metal', 'sort_order' => 110],
        ['key' => 'geram24', 'title' => 'طلای ۲۴ عیار', 'symbol' => '24K', 'unit' => 'ریال', 'group' => 'metal', 'sort_order' => 120],
        ['key' => 'mesghal', 'title' => 'مثقال طلا', 'symbol' => 'MITHQAL', 'unit' => 'ریال', 'group' => 'metal', 'sort_order' => 130],
        ['key' => 'sekee', 'title' => 'سکه امامی', 'symbol' => 'Emami', 'unit' => 'ریال', 'group' => 'coin', 'sort_order' => 210],
        ['key' => 'sekeb', 'title' => 'سکه بهار آزادی', 'symbol' => 'Bahar', 'unit' => 'ریال', 'group' => 'coin', 'sort_order' => 220],
        ['key' => 'nim', 'title' => 'نیم سکه', 'symbol' => '1/2', 'unit' => 'ریال', 'group' => 'coin', 'sort_order' => 230],
        ['key' => 'rob', 'title' => 'ربع سکه', 'symbol' => '1/4', 'unit' => 'ریال', 'group' => 'coin', 'sort_order' => 240],
        ['key' => 'gerami', 'title' => 'سکه گرمی', 'symbol' => '1g', 'unit' => 'ریال', 'group' => 'coin', 'sort_order' => 250],
    ];

    public function sync(): array
    {
        $source = $this->source();
        $startedAt = Carbon::now();
        $log = MarketRateSyncLog::query()->create([
            'source_id' => $source->id,
            'status' => 'running',
            'started_at' => $startedAt,
        ]);

        try {
            $payload = $this->fetch();
            $current = $payload['current'] ?? [];
            $fetchedAt = Carbon::now();
            $synced = 0;

            DB::transaction(function () use ($source, $current, $fetchedAt, &$synced) {
                foreach (self::DEFINITIONS as $definition) {
                    $raw = $current[$definition['key']] ?? null;

                    if (!$raw) {
                        continue;
                    }

                    $instrument = MarketRateInstrument::query()->updateOrCreate(
                        ['source_id' => $source->id, 'key' => $definition['key']],
                        [
                            'group' => $definition['group'],
                            'title' => $definition['title'],
                            'symbol' => $definition['symbol'],
                            'unit' => $definition['unit'],
                            'sort_order' => $definition['sort_order'],
                            'is_active' => true,
                        ]
                    );

                    MarketRateSnapshot::query()->create([
                        'instrument_id' => $instrument->id,
                        'price' => $raw['p'] ?? null,
                        'high' => $raw['h'] ?? null,
                        'low' => $raw['l'] ?? null,
                        'change_value' => $raw['d'] ?? null,
                        'change_percent' => isset($raw['dp']) ? (float) $raw['dp'] : null,
                        'direction' => $raw['dt'] ?? null,
                        'source_updated_at' => $this->parseSourceTime($raw['ts'] ?? null),
                        'fetched_at' => $fetchedAt,
                    ]);

                    $synced++;
                }
            });

            $log->update([
                'status' => 'success',
                'message' => "Synced {$synced} market-rate instruments.",
                'finished_at' => Carbon::now(),
            ]);

            return $this->board();
        } catch (\Throwable $exception) {
            $log->update([
                'status' => 'failed',
                'message' => $exception->getMessage(),
                'finished_at' => Carbon::now(),
            ]);

            throw $exception;
        }
    }

    public function board(): array
    {
        $source = $this->source();
        $instruments = MarketRateInstrument::query()
            ->where('source_id', $source->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $rates = $instruments->map(function (MarketRateInstrument $instrument) {
            $snapshot = MarketRateSnapshot::query()
                ->where('instrument_id', $instrument->id)
                ->latest('fetched_at')
                ->first();

            return [
                'key' => $instrument->key,
                'title' => $instrument->title,
                'symbol' => $instrument->symbol,
                'unit' => $instrument->unit,
                'group' => $instrument->group,
                'price' => $snapshot?->price ?? 'ناموجود',
                'high' => $snapshot?->high ?? 'ناموجود',
                'low' => $snapshot?->low ?? 'ناموجود',
                'change' => $snapshot?->change_value ?? '۰',
                'changePercent' => $snapshot?->change_percent !== null ? (float) $snapshot->change_percent : null,
                'direction' => $this->normalizeDirection($snapshot?->direction),
                'updatedAt' => $snapshot?->source_updated_at?->toDateTimeString() ?? 'نامشخص',
            ];
        })->values();

        return [
            'rates' => $rates,
            'fetchedAt' => Carbon::now('Asia/Tehran')->toDateTimeString(),
        ];
    }

    private function fetch(): array
    {
        $url = config('services.tgju.url', env('TGJU_API_URL'));

        return Http::timeout(12)
            ->retry(2, 500)
            ->acceptJson()
            ->get($url)
            ->throw()
            ->json();
    }

    private function source(): MarketRateSource
    {
        return MarketRateSource::query()->firstOrCreate(
            ['key' => self::SOURCE_KEY],
            [
                'name' => self::SOURCE_NAME,
                'base_url' => null,
                'is_active' => true,
            ]
        );
    }

    private function parseSourceTime(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value, 'Asia/Tehran');
        } catch (\Throwable) {
            return null;
        }
    }

    private function normalizeDirection(?string $direction): string
    {
        return match ($direction) {
            'high' => 'high',
            'low' => 'low',
            default => 'neutral',
        };
    }
}
