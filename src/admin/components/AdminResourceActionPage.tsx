"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bold, Eye, Italic, List, Save, Type, Underline } from "lucide-react";
import { toast } from "react-toastify";
import { AccuracyBadge, BooleanBadge, PublishBadge } from "@/admin/components/AdminBadges";
import { AdminShell } from "@/admin/components/AdminShell";
import type { Accuracy } from "@/admin/data/adminMockData";
import {
  findAdminRecord,
  loadAdminCountries,
  loadAdminLookup,
  loadAdminPage,
  saveAdminRecord,
  type AdminCountryRecord,
  type AdminContentRecord,
  type AdminGridRecord,
  type AdminMenuRecord,
  type AdminResource,
  type AdminSimpleRecord,
  type AdminWorldClockRecord
} from "@/admin/lib/adminApi";

type AdminResourceActionPageProps = {
  action: "add" | "view" | "edit";
  id?: string;
  resource: string;
};

type ContentResource = "articles" | "news";
type SimpleResource = "tags" | "services";

const actionLabels = {
  add: "ایجاد",
  view: "مشاهده",
  edit: "ویرایش"
};

const accuracyOptions: { label: string; value: Accuracy }[] = [
  { label: "در انتظار تایید", value: 0 },
  { label: "تایید شده", value: 1 },
  { label: "حذف شده", value: 2 }
];

const publishOptions = [
  { label: "پیش‌نویس", value: "false" },
  { label: "منتشر شده", value: "true" }
];

const approveOptions = [
  { label: "در انتظار تایید", value: "false" },
  { label: "تایید شده", value: "true" }
];

function toBoolean(value: FormDataEntryValue | null) {
  return value === "true";
}

function toNumberOrNull(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && String(value ?? "") !== "" ? parsed : null;
}

function FieldShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="admin-form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ disabled, defaultValue, dir = "rtl", name, placeholder }: { disabled: boolean; defaultValue?: string | number | null; dir?: "rtl" | "ltr"; name: string; placeholder?: string }) {
  return <input defaultValue={defaultValue ?? ""} dir={dir} disabled={disabled} name={name} placeholder={placeholder} />;
}

function TextAreaInput({ disabled, defaultValue, name, placeholder }: { disabled: boolean; defaultValue?: string | null; name: string; placeholder?: string }) {
  return <textarea defaultValue={defaultValue ?? ""} dir="rtl" disabled={disabled} name={name} placeholder={placeholder} rows={4} />;
}

function ChoiceInput({ disabled, defaultValue, name, options }: { disabled: boolean; defaultValue?: string | number | boolean | null; name: string; options: { label: string; value: string | number }[] }) {
  return (
    <select className="admin-select-field" defaultValue={String(defaultValue ?? options[0]?.value ?? "")} disabled={disabled} name={name}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function StatusFields({ accuracy, disabled, isPublished, withPublish = true }: { accuracy: Accuracy; disabled: boolean; isPublished?: boolean; withPublish?: boolean }) {
  if (disabled) {
    return (
      <div className="admin-form-status-row">
        <div>
          <span>وضعیت</span>
          <AccuracyBadge value={accuracy} />
        </div>
        {withPublish ? (
          <div>
            <span>وضعیت انتشار</span>
            <PublishBadge value={Boolean(isPublished)} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="admin-form-grid two">
      <FieldShell label="وضعیت">
        <ChoiceInput disabled={false} defaultValue={accuracy} name="accuracy" options={accuracyOptions} />
      </FieldShell>
      {withPublish ? (
        <FieldShell label="وضعیت انتشار">
          <ChoiceInput disabled={false} defaultValue={String(Boolean(isPublished))} name="isPublished" options={publishOptions} />
        </FieldShell>
      ) : null}
    </div>
  );
}

function EditorField({ disabled, defaultValue }: { disabled: boolean; defaultValue?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const runCommand = (command: string, commandValue?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    setValue(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="admin-editor-field">
      <input name="content" type="hidden" value={value} />
      <div className="admin-editor-toolbar">
        {[
          { icon: Type, command: "formatBlock", value: "p", label: "متن" },
          { icon: Bold, command: "bold", label: "Bold" },
          { icon: Italic, command: "italic", label: "Italic" },
          { icon: Underline, command: "underline", label: "Underline" },
          { icon: List, command: "insertUnorderedList", label: "List" }
        ].map(({ command, icon: Icon, label, value: commandValue }) => (
          <button aria-label={label} disabled={disabled} key={label} onClick={() => runCommand(command, commandValue)} type="button">
            <Icon size={14} />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="admin-rich-editor"
        contentEditable={!disabled}
        dangerouslySetInnerHTML={{ __html: value }}
        dir="rtl"
        onInput={(event) => setValue(event.currentTarget.innerHTML)}
        role="textbox"
        suppressContentEditableWarning
      />
    </div>
  );
}

function TagPicker({ disabled, selectedIds = [] }: { disabled: boolean; selectedIds?: number[] }) {
  const [tags, setTags] = useState<AdminSimpleRecord[]>([]);

  useEffect(() => {
    loadAdminLookup("tags", { accuracy: 1 })
      .then(({ response: { items } }) => setTags(items as AdminSimpleRecord[]))
      .catch(() => setTags([]));
  }, []);

  return (
    <div className="admin-select-stack">
      {tags.length === 0 ? <span className="admin-chip-empty">تگی ثبت نشده است</span> : null}
      <select className="admin-select-field" defaultValue={selectedIds.map(String)} disabled={disabled || tags.length === 0} multiple name="tagIds" size={Math.min(Math.max(tags.length, 3), 6)}>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>{tag.title}</option>
        ))}
      </select>
    </div>
  );
}

function AdminFormFrame({ action, children, id, onSubmit, resource, title }: { action: "add" | "view" | "edit"; children: ReactNode; id?: number; onSubmit?: (event: FormEvent<HTMLFormElement>) => void; resource: string; title: string }) {
  const readonly = action === "view";

  return (
    <form className="admin-form-card" onSubmit={onSubmit}>
      <div className="admin-form-heading">
        <div>
          <span>{resource}</span>
          <h2>{title}</h2>
        </div>
        <div className="admin-form-actions">
          <a href={`/admin/${resource}/list`}>بازگشت</a>
          {readonly ? (
            id ? <a href={`/admin/${resource}/edit/${id}`}><Eye size={14} /> ویرایش</a> : null
          ) : (
            <button type="submit"><Save size={14} /> ذخیره</button>
          )}
        </div>
      </div>
      {children}
    </form>
  );
}

function useAdminRecord(resource: AdminResource, action: "add" | "view" | "edit", id?: string) {
  const [record, setRecord] = useState<AdminGridRecord | null>(null);
  const [isLoading, setIsLoading] = useState(action !== "add");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (action === "add") {
      setRecord(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!id) {
      setError("Record id is required.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    findAdminRecord(resource, id)
      .then(({ response: { items } }) => {
        if (!ignore) {
          setRecord(items[0] ?? null);
        }
      })
      .catch((reason: unknown) => {
        if (!ignore) {
          setError(reason instanceof Error ? reason.message : "Find request failed.");
          setRecord(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [action, id, resource]);

  return { error, isLoading, record };
}

function MenuForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord("menus", action, id);
  const row = record as AdminMenuRecord | null;
  const [menuOptions, setMenuOptions] = useState<AdminMenuRecord[]>([]);

  useEffect(() => {
    loadAdminPage("menus")
      .then(({ response: { items } }) => setMenuOptions(items as AdminMenuRecord[]))
      .catch(() => setMenuOptions([]));
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveAdminRecord("menus", action === "edit" ? "update" : "add", {
      id: row?.id,
      title: form.get("title"),
      url: form.get("url"),
      slug: form.get("slug"),
      parentId: toNumberOrNull(form.get("parentId")),
      level: Number(form.get("level") ?? 1),
      seoTitle: form.get("seoTitle"),
      seoDescription: form.get("seoDescription"),
      accuracy: Number(form.get("accuracy") ?? 0),
      isPublished: toBoolean(form.get("isPublished"))
    })
      .then(() => toast.success("منو با موفقیت ذخیره شد."))
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : "ذخیره منو ناموفق بود."));
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="menus" title={action === "add" ? "ایجاد منو" : row?.title ?? "منو"}>
      <div className="admin-form-grid two">
        <FieldShell label="عنوان منو">
          <TextInput disabled={disabled} defaultValue={row?.title} name="title" placeholder="مثلا خدمات" />
        </FieldShell>
        <FieldShell label="آدرس">
          <TextInput disabled={disabled} defaultValue={row?.url} dir="ltr" name="url" placeholder="/services" />
        </FieldShell>
        <FieldShell label="آدرس انگلیسی">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="services" />
        </FieldShell>
        <FieldShell label="منوی والد">
          <ChoiceInput disabled={disabled} defaultValue={row?.parentId ?? ""} name="parentId" options={[{ label: "منوی اصلی", value: "" }, ...menuOptions.filter((item) => item.id !== row?.id).map((item) => ({ label: item.title, value: item.id }))]} />
        </FieldShell>
        <FieldShell label="سطح منو">
          <ChoiceInput disabled={disabled} defaultValue={row?.level ?? 1} name="level" options={[1, 2, 3].map((level) => ({ label: String(level), value: level }))} />
        </FieldShell>
        <FieldShell label="عنوان SEO">
          <TextInput disabled={disabled} defaultValue={row?.seoTitle} name="seoTitle" />
        </FieldShell>
        <FieldShell label="توضیح SEO">
          <TextInput disabled={disabled} defaultValue={row?.seoDescription} name="seoDescription" />
        </FieldShell>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? false} />
    </AdminFormFrame>
  );
}

function ContentForm({ action, id, resource }: { action: "add" | "view" | "edit"; id?: string; resource: ContentResource }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord(resource, action, id);
  const row = record as AdminContentRecord | null;
  const title = resource === "articles" ? "مقاله" : "خبر";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveAdminRecord(resource, action === "edit" ? "update" : "add", {
      id: row?.id,
      title: form.get("title"),
      headline: form.get("headline"),
      slug: form.get("slug"),
      categoryId: toNumberOrNull(form.get("categoryId")),
      seoTitle: form.get("seoTitle"),
      seoDescription: form.get("seoDescription"),
      content: form.get("content"),
      approve: toBoolean(form.get("approve")),
      scheduledAt: form.get("scheduledAt"),
      accuracy: Number(form.get("accuracy") ?? 0),
      isPublished: toBoolean(form.get("isPublished")),
      tagIds: form.getAll("tagIds").map((value) => Number(value)).filter(Number.isFinite)
    })
      .then(() => toast.success(`${title} با موفقیت ذخیره شد.`))
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : `ذخیره ${title} ناموفق بود.`));
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource={resource} title={action === "add" ? `ایجاد ${title}` : row?.title ?? title}>
      <div className="admin-form-grid two">
        <FieldShell label={`عنوان ${title}`}>
          <TextInput disabled={disabled} defaultValue={row?.title} name="title" placeholder={`عنوان ${title}`} />
        </FieldShell>
        <FieldShell label={`سرتیتر ${title}`}>
          <TextInput disabled={disabled} defaultValue={row?.headline} name="headline" placeholder="Headline" />
        </FieldShell>
        <FieldShell label="آدرس انگلیسی">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="content-slug" />
        </FieldShell>
        <FieldShell label="شناسه دسته‌بندی">
          <TextInput disabled={disabled} defaultValue={row?.categoryId ?? ""} dir="ltr" name="categoryId" placeholder="Category ID" />
        </FieldShell>
        <FieldShell label="عنوان SEO">
          <TextInput disabled={disabled} defaultValue={row?.seoTitle} name="seoTitle" />
        </FieldShell>
        <FieldShell label="توضیح SEO">
          <TextInput disabled={disabled} defaultValue={row?.seoDescription} name="seoDescription" />
        </FieldShell>
      </div>
      <div className="admin-form-grid two">
        <FieldShell label="تایید محتوا">
          {disabled ? <BooleanBadge falseLabel="در انتظار تایید" trueLabel="تایید شده" value={Boolean(row?.approve)} /> : <ChoiceInput disabled={false} defaultValue={String(row?.approve ?? false)} name="approve" options={approveOptions} />}
        </FieldShell>
        <FieldShell label="زمان‌بندی انتشار">
          <TextInput disabled={disabled} defaultValue={row?.scheduledAt ?? ""} dir="ltr" name="scheduledAt" placeholder="2026-06-25 09:00:00" />
        </FieldShell>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? false} />
      <section className="admin-form-section">
        <h2>تگ‌های {title}</h2>
        <TagPicker disabled={disabled} selectedIds={row?.tagIds ?? []} />
      </section>
      <section className="admin-form-section">
        <h2>محتوای {title}</h2>
        <EditorField disabled={disabled} defaultValue={row?.content ?? ""} />
      </section>
    </AdminFormFrame>
  );
}

function SimpleForm({ action, id, resource }: { action: "add" | "view" | "edit"; id?: string; resource: SimpleResource }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord(resource, action, id);
  const row = record as AdminSimpleRecord | null;
  const title = resource === "services" ? "خدمت" : "تگ";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    saveAdminRecord(resource, action === "edit" ? "update" : "add", {
      id: row?.id,
      title: form.get("title"),
      slug: form.get("slug"),
      summary: form.get("summary"),
      cta: form.get("cta"),
      isPublished: toBoolean(form.get("isPublished")),
      accuracy: Number(form.get("accuracy") ?? 0)
    })
      .then(() => toast.success(`${title} با موفقیت ذخیره شد.`))
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : `ذخیره ${title} ناموفق بود.`));
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource={resource} title={action === "add" ? `ایجاد ${title}` : row?.title ?? title}>
      <div className="admin-form-grid two">
        <FieldShell label="عنوان">
          <TextInput disabled={disabled} defaultValue={row?.title} name="title" placeholder={resource === "services" ? "مثلا ترخیص کالا" : "مثلا حمل دریایی"} />
        </FieldShell>
        <FieldShell label="آدرس انگلیسی">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="customs-clearance" />
        </FieldShell>
        {resource === "services" ? (
          <>
            <FieldShell label="متن دکمه کارت">
              <TextInput disabled={disabled} defaultValue={row?.cta ?? ""} name="cta" placeholder="مشاهده خدمت" />
            </FieldShell>
            <FieldShell label="توضیح کارت خدمات">
              <TextAreaInput disabled={disabled} defaultValue={row?.summary ?? row?.description ?? ""} name="summary" placeholder="توضیح کوتاه برای کارت خدمات صفحه اصلی" />
            </FieldShell>
          </>
        ) : null}
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? true} withPublish={resource === "services"} />
    </AdminFormFrame>
  );
}

function WorldClockForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord("world-clocks", action, id);
  const row = record as AdminWorldClockRecord | null;
  const [countries, setCountries] = useState<AdminCountryRecord[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(row?.countryId ?? null);

  useEffect(() => {
    setSelectedCountryId(row?.countryId ?? null);
  }, [row?.countryId]);

  useEffect(() => {
    loadAdminCountries()
      .then(({ response: { items } }) => setCountries(items))
      .catch(() => setCountries([]));
  }, []);

  const selectedCountry = countries.find((country) => country.id === selectedCountryId);
  const groupedCountries = useMemo(() => {
    return countries.reduce<Record<string, AdminCountryRecord[]>>((groups, country) => {
      const key = country.continent || "Other";
      groups[key] = [...(groups[key] ?? []), country];
      return groups;
    }, {});
  }, [countries]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const save = () => saveAdminRecord("world-clocks", action === "edit" ? "update" : "add", {
      id: row?.id,
      countryId: toNumberOrNull(form.get("countryId")),
      city: form.get("city"),
      country: form.get("country"),
      countryCode: form.get("countryCode"),
      continent: form.get("continent"),
      timezone: form.get("timezone"),
      marketLabel: form.get("marketLabel"),
      sortOrder: Number(form.get("sortOrder") ?? 0),
      accuracy: Number(form.get("accuracy") ?? 0),
      isPublished: toBoolean(form.get("isPublished"))
    })
      .then(() => toast.success("ساعت جهانی با موفقیت ذخیره شد."))
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : "ذخیره ساعت جهانی ناموفق بود."));

    if (action === "add") {
      loadAdminPage("world-clocks")
        .then(({ response: { items } }) => {
          const activeCount = items.filter((item) => item.accuracy !== 2).length;
          if (activeCount >= 6) {
            toast.error("برای ساعت جهانی حداکثر ۶ کشور قابل نمایش است.");
            return;
          }
          save();
        })
        .catch(() => save());
      return;
    }

    save();
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="world-clocks" title={action === "add" ? "ایجاد ساعت جهانی" : row?.city ?? "ساعت جهانی"}>
      <div className="admin-form-grid two">
        <FieldShell label="کشور و پایتخت">
          <div className="admin-select-stack">
            <select
              className="admin-select-field"
              defaultValue={selectedCountryId ?? row?.countryId ?? ""}
              disabled={disabled}
              name="countryId"
              onChange={(event) => setSelectedCountryId(toNumberOrNull(event.currentTarget.value) as number | null)}
            >
              <option value="">انتخاب کشور</option>
              {Object.entries(groupedCountries).map(([continent, items]) => (
                <optgroup key={continent} label={continent}>
                  {items.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.nameFa} - {country.capital ?? country.nameEn}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input name="country" type="hidden" value={selectedCountry?.nameFa ?? row?.country ?? ""} />
            <input name="countryCode" type="hidden" value={selectedCountry?.iso2 ?? row?.countryCode ?? ""} />
            <input name="continent" type="hidden" value={selectedCountry?.continent ?? row?.continent ?? ""} />
            {Object.entries(groupedCountries).map(([continent, items]) => (
              <span className="admin-select-hint" key={continent}>{continent}: {items.length} کشور</span>
            ))}
            {countries.length === 0 ? <span className="admin-chip-empty">کشوری برای انتخاب آماده نیست</span> : null}
          </div>
        </FieldShell>
        <FieldShell label="پایتخت / شهر نمایشی">
          <TextInput disabled={disabled} defaultValue={row?.city ?? selectedCountry?.capital ?? ""} name="city" placeholder="Tehran" />
        </FieldShell>
        <FieldShell label="Timezone">
          <TextInput disabled={disabled} defaultValue={row?.timezone} dir="ltr" name="timezone" placeholder="Asia/Tehran" />
        </FieldShell>
        <FieldShell label="برچسب بازار">
          <TextInput disabled={disabled} defaultValue={row?.marketLabel} name="marketLabel" placeholder="بازار ایران" />
        </FieldShell>
        <FieldShell label="ترتیب نمایش">
          <TextInput disabled={disabled} defaultValue={row?.sortOrder ?? 0} dir="ltr" name="sortOrder" placeholder="1" />
        </FieldShell>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? false} />
    </AdminFormFrame>
  );
}

export function AdminResourceActionPage({ action, id, resource }: AdminResourceActionPageProps) {
  const supported = useMemo(() => ["menus", "services", "articles", "news", "tags", "world-clocks"].includes(resource), [resource]);

  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-page-heading">
          <span>{actionLabels[action]}</span>
          <h1>{actionLabels[action]} {resource}</h1>
          <p>فرم مدیریت این بخش به سرویس بک‌اند متصل است و داده فیک نمایش نمی‌دهد.</p>
        </section>

        {resource === "menus" ? <MenuForm action={action} id={id} /> : null}
        {resource === "articles" || resource === "news" ? <ContentForm action={action} id={id} resource={resource} /> : null}
        {resource === "tags" || resource === "services" ? <SimpleForm action={action} id={id} resource={resource} /> : null}
        {resource === "world-clocks" ? <WorldClockForm action={action} id={id} /> : null}
        {!supported ? (
          <section className="admin-empty-state">
            <strong>فرم این بخش آماده نیست</strong>
            <p>برای این منو در فازهای بعدی فرم اختصاصی ساخته می‌شود.</p>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
