"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bold, Check, ChevronDown, Eye, Italic, List, Save, Search, Type, Underline, X } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AccuracyBadge, BooleanBadge, PublishBadge } from "@/admin/components/AdminBadges";
import { AdminShell } from "@/admin/components/AdminShell";
import type { Accuracy } from "@/admin/data/adminMockData";
import { formatPersianDateTime } from "@/admin/lib/date";
import {
  findAdminRecord,
  loadAdminCountryCities,
  loadAdminCountries,
  loadAdminLookup,
  loadAdminPage,
  saveAdminRecord,
  type AdminCategoryRecord,
  type AdminCountryRecord,
  type AdminCityOption,
  type AdminContentRecord,
  type AdminContentSourceRecord,
  type AdminGridRecord,
  type AdminMenuRecord,
  type AdminResource,
  type AdminSimpleRecord,
  type AdminSourceItemRecord,
  type AdminWorldClockRecord
} from "@/admin/lib/adminApi";

type AdminResourceActionPageProps = {
  action: "add" | "view" | "edit";
  id?: string;
  resource: string;
};

type ContentResource = "articles" | "news";
type SimpleResource = "tags" | "services" | "pages";
type CategoryType = "encyclopedia" | "news" | "circular";

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

const categoryTypeOptions: { label: string; value: CategoryType }[] = [
  { label: "دانشنامه تجاری", value: "encyclopedia" },
  { label: "اخبار تجارت", value: "news" },
  { label: "بخشنامه‌ها", value: "circular" }
];

type AdminDropdownOption = {
  group?: string;
  label: string;
  value: string | number;
};

function toBoolean(value: FormDataEntryValue | null) {
  return value === "true";
}

function toNumberOrNull(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && String(value ?? "") !== "" ? parsed : null;
}

const minimumSaveFeedbackMs = 1000;

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function keepMinimumSaveFeedback(startedAt: number) {
  const remainingMs = minimumSaveFeedbackMs - (performance.now() - startedAt);
  if (remainingMs > 0) {
    await wait(remainingMs);
  }
}

function FieldShell({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <label className={`admin-form-field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ disabled, defaultValue, dir = "rtl", name, placeholder }: { disabled: boolean; defaultValue?: string | number | null; dir?: "rtl" | "ltr"; name: string; placeholder?: string }) {
  return <input defaultValue={defaultValue ?? ""} dir={dir} disabled={disabled} name={name} placeholder={placeholder} />;
}

function DateTextInput({ disabled, defaultValue, name, placeholder }: { disabled: boolean; defaultValue?: string | null; name: string; placeholder?: string }) {
  const [dateValue, setDateValue] = useState<DateObject | null>(() => {
    if (!defaultValue) {
      return null;
    }

    try {
      return new DateObject({
        calendar: gregorian,
        date: defaultValue,
        format: "YYYY-MM-DD HH:mm:ss",
        locale: gregorian_en
      }).convert(persian, persian_fa);
    } catch {
      return null;
    }
  });
  const gregorianValue = dateValue
    ? new DateObject(dateValue).convert(gregorian, gregorian_en).format("YYYY-MM-DD HH:mm:ss")
    : (defaultValue ?? "");
  const persianValue = dateValue ? new DateObject(dateValue).format("YYYY/MM/DD HH:mm") : formatPersianDateTime(defaultValue);

  return (
    <div className="admin-date-field">
      <input name={name} type="hidden" value={gregorianValue} />
      {disabled ? (
        <input disabled dir="rtl" value={persianValue || "-"} />
      ) : (
        <DatePicker
          calendar={persian}
          calendarPosition="bottom-right"
          containerClassName="admin-date-picker"
          format="YYYY/MM/DD HH:mm"
          inputClass="admin-date-picker-input"
          locale={persian_fa}
          onChange={(nextValue) => setDateValue(nextValue as DateObject | null)}
          placeholder={placeholder ?? "انتخاب تاریخ"}
          plugins={[<TimePicker hideSeconds key="time-picker" position="bottom" />]}
          value={dateValue}
        />
      )}
    </div>
  );
}

function TextAreaInput({ className = "", disabled, defaultValue, maxLength, name, placeholder, rows = 4 }: { className?: string; disabled: boolean; defaultValue?: string | null; maxLength?: number; name: string; placeholder?: string; rows?: number }) {
  return <textarea className={className} defaultValue={defaultValue ?? ""} dir="rtl" disabled={disabled} maxLength={maxLength} name={name} placeholder={placeholder} rows={rows} />;
}

function AdminDropdown({
  defaultValue,
  disabled,
  emptyLabel = "گزینه‌ای پیدا نشد",
  multiple = false,
  name,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  searchable = false,
  value
}: {
  defaultValue?: string | number | boolean | Array<string | number> | null;
  disabled: boolean;
  emptyLabel?: string;
  multiple?: boolean;
  name: string;
  onChange?: (value: string | string[]) => void;
  options: AdminDropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  value?: string | number | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedDefaultValue = useMemo(() => {
    const rawValue = value ?? defaultValue;
    if (Array.isArray(rawValue)) {
      return rawValue.map(String);
    }
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return [];
    }
    return [String(rawValue)];
  }, [defaultValue, value]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(normalizedDefaultValue);

  useEffect(() => {
    setSelectedValues(normalizedDefaultValue);
  }, [normalizedDefaultValue]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOptions = selectedValues
    .map((selectedValue) => options.find((option) => String(option.value) === selectedValue))
    .filter((option): option is AdminDropdownOption => Boolean(option));

  const filteredOptions = options.filter((option) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return true;
    }
    return `${option.label} ${option.group ?? ""}`.toLowerCase().includes(normalizedQuery);
  });

  const groupedOptions = filteredOptions.reduce<Record<string, AdminDropdownOption[]>>((groups, option) => {
    const group = option.group ?? "";
    groups[group] = [...(groups[group] ?? []), option];
    return groups;
  }, {});

  const updateSelection = (nextValues: string[]) => {
    setSelectedValues(nextValues);
    onChange?.(multiple ? nextValues : nextValues[0] ?? "");
  };

  const toggleOption = (optionValue: string) => {
    if (disabled) {
      return;
    }

    if (multiple) {
      const nextValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
        : [...selectedValues, optionValue];
      updateSelection(nextValues);
      return;
    }

    updateSelection([optionValue]);
    setIsOpen(false);
    setQuery("");
  };

  const clearItem = (event: React.MouseEvent<HTMLSpanElement>, optionValue: string) => {
    event.preventDefault();
    event.stopPropagation();
    updateSelection(selectedValues.filter((selectedValue) => selectedValue !== optionValue));
  };

  return (
    <div className={`admin-dropdown ${isOpen ? "is-open" : ""} ${disabled ? "is-disabled" : ""}`} ref={rootRef}>
      {multiple ? (
        selectedValues.map((selectedValue) => <input key={selectedValue} name={name} type="hidden" value={selectedValue} />)
      ) : (
        <input name={name} type="hidden" value={selectedValues[0] ?? ""} />
      )}
      <button className="admin-dropdown-control" disabled={disabled} onClick={() => setIsOpen((current) => !current)} type="button">
        <span className="admin-dropdown-value">
          {selectedOptions.length === 0 ? (
            <span className="admin-dropdown-placeholder">{placeholder}</span>
          ) : multiple ? (
            <span className="admin-dropdown-tags">
              {selectedOptions.map((option) => (
                <span className="admin-dropdown-tag" key={option.value}>
                  {option.label}
                  {!disabled ? (
                    <span aria-label={`حذف ${option.label}`} onClick={(event) => clearItem(event, String(option.value))} role="button" tabIndex={-1}>
                      <X size={11} />
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          ) : (
            selectedOptions[0]?.label
          )}
        </span>
        <ChevronDown className="admin-dropdown-chevron" size={15} />
      </button>
      {isOpen && !disabled ? (
        <div className="admin-dropdown-panel">
          {searchable ? (
            <div className="admin-dropdown-search">
              <Search size={14} />
              <input autoFocus dir="rtl" onChange={(event) => setQuery(event.target.value)} placeholder="جستجو..." value={query} />
            </div>
          ) : null}
          <div className="admin-dropdown-options">
            {filteredOptions.length === 0 ? <span className="admin-dropdown-empty">{emptyLabel}</span> : null}
            {Object.entries(groupedOptions).map(([group, items]) => (
              <div className="admin-dropdown-group" key={group || "default"}>
                {group ? <span className="admin-dropdown-group-title">{group}</span> : null}
                {items.map((option) => {
                  const optionValue = String(option.value);
                  const isSelected = selectedValues.includes(optionValue);

                  return (
                    <button className={isSelected ? "is-selected" : ""} key={optionValue} onClick={() => toggleOption(optionValue)} type="button">
                      <span>{option.label}</span>
                      {isSelected ? <Check size={14} /> : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChoiceInput({ disabled, defaultValue, name, options, searchable = false }: { disabled: boolean; defaultValue?: string | number | boolean | null; name: string; options: AdminDropdownOption[]; searchable?: boolean }) {
  return (
    <AdminDropdown
      defaultValue={String(defaultValue ?? options[0]?.value ?? "")}
      disabled={disabled}
      name={name}
      options={options}
      searchable={searchable}
    />
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
        data-dynamic-content
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
  const [currentIds, setCurrentIds] = useState<number[]>(selectedIds);

  useEffect(() => {
    loadAdminLookup("tags", { accuracy: 1 })
      .then(({ response: { items } }) => setTags(items as AdminSimpleRecord[]))
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    setCurrentIds(selectedIds);
  }, [selectedIds]);

  const tagifyValue = useMemo(() => {
    return tags
      .filter((tag) => currentIds.includes(tag.id))
      .map((tag) => ({ id: tag.id, value: tag.title }));
  }, [currentIds, tags]);

  const whitelist = useMemo(() => tags.map((tag) => ({
    id: tag.id,
    searchBy: `${tag.title} ${tag.slug}`,
    value: tag.title
  })), [tags]);

  const handleTagChange = (event: { detail: { value: string } }) => {
    try {
      const values = JSON.parse(event.detail.value || "[]") as Array<{ id?: number; value?: string }>;
      setCurrentIds(values
        .map((item) => item.id ?? tags.find((tag) => tag.title === item.value)?.id)
        .filter((tagId): tagId is number => Number.isFinite(tagId)));
    } catch {
      setCurrentIds([]);
    }
  };

  return (
    <div className="admin-tagify-field">
      {tags.length === 0 ? <span className="admin-chip-empty">تگی ثبت نشده است</span> : null}
      {currentIds.map((tagId) => <input key={tagId} name="tagIds" type="hidden" value={tagId} />)}
      <Tags
        disabled={disabled || tags.length === 0}
        onChange={handleTagChange}
        placeholder="انتخاب تگ از لیست"
        settings={{
          addTagOnBlur: false,
          dropdown: {
            closeOnSelect: false,
            enabled: 0,
            maxItems: 20,
            searchKeys: ["value", "searchBy"]
          },
          enforceWhitelist: true,
          originalInputValueFormat: (values: Array<{ id?: number; value?: string }>) => JSON.stringify(values),
          userInput: !disabled
        }}
        value={tagifyValue}
        whitelist={whitelist}
      />
    </div>
  );
}

function AdminFormFrame({ action, children, id, onSubmit, resource, title }: { action: "add" | "view" | "edit"; children: ReactNode; id?: number; onSubmit?: (event: FormEvent<HTMLFormElement>) => Promise<void>; resource: string; title: string }) {
  const readonly = action === "view";
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleFrameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit || isSaving) {
      return;
    }

    const startedAt = performance.now();
    setIsSaving(true);

    try {
      await onSubmit(event);
      await keepMinimumSaveFeedback(startedAt);
      router.push(`/admin/${resource}/list`);
    } catch {
      await keepMinimumSaveFeedback(startedAt);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="admin-form-card" onSubmit={handleFrameSubmit}>
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
            <button className={isSaving ? "is-loading" : ""} disabled={isSaving} type="submit">
              <Save size={14} />
              {isSaving ? "در حال ذخیره..." : "ذخیره"}
            </button>
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord("menus", action === "edit" ? "update" : "add", {
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
      });
      toast.success("منو با موفقیت ذخیره شد.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "ذخیره منو ناموفق بود.");
      throw reason;
    }
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
        <FieldShell label="منوی والد">
          <ChoiceInput disabled={disabled} defaultValue={row?.parentId ?? ""} name="parentId" options={[{ label: "منوی اصلی", value: "" }, ...menuOptions.filter((item) => item.id !== row?.id).map((item) => ({ label: item.title, value: item.id }))]} />
        </FieldShell>
        <FieldShell label="سطح منو">
          <ChoiceInput disabled={disabled} defaultValue={row?.level ?? 1} name="level" options={[1, 2, 3].map((level) => ({ label: String(level), value: level }))} />
        </FieldShell>
      </div>
      <div className="admin-form-balanced-grid">
        <FieldShell label="توضیح SEO">
          <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.seoDescription} maxLength={160} name="seoDescription" placeholder="توضیح کوتاه صفحه برای نمایش در نتایج جستجو" rows={4} />
        </FieldShell>
        <div className="admin-form-field-stack">
          <FieldShell label="آدرس انگلیسی">
            <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="services" />
          </FieldShell>
          <FieldShell label="عنوان SEO">
            <TextInput disabled={disabled} defaultValue={row?.seoTitle} name="seoTitle" />
          </FieldShell>
        </div>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? false} />
    </AdminFormFrame>
  );
}

function CategoryForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord("categories", action, id);
  const row = record as AdminCategoryRecord | null;
  const [categoryOptions, setCategoryOptions] = useState<AdminCategoryRecord[]>([]);

  useEffect(() => {
    loadAdminLookup("categories")
      .then(({ response: { items } }) => setCategoryOptions((items as AdminCategoryRecord[]).filter((item) => item.accuracy !== 2)))
      .catch(() => setCategoryOptions([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord("categories", action === "edit" ? "update" : "add", {
        id: row?.id,
        title: form.get("title"),
        slug: form.get("slug"),
        parentId: toNumberOrNull(form.get("parentId")),
        type: form.get("type"),
        summary: form.get("summary"),
        contentTop: form.get("contentTop"),
        contentBottom: form.get("contentBottom"),
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        canonicalUrl: form.get("canonicalUrl"),
        coverImageUrl: form.get("coverImageUrl"),
        sortOrder: Number(form.get("sortOrder") ?? 0),
        accuracy: Number(form.get("accuracy") ?? 0),
        isPublished: toBoolean(form.get("isPublished")),
        isIndexable: toBoolean(form.get("isIndexable"))
      });
      toast.success("دسته‌بندی با موفقیت ذخیره شد.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "ذخیره دسته‌بندی ناموفق بود.");
      throw reason;
    }
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="categories" title={action === "add" ? "ایجاد دسته‌بندی" : row?.title ?? "دسته‌بندی"}>
      <div className="admin-form-grid two">
        <FieldShell label="عنوان دسته‌بندی">
          <TextInput disabled={disabled} defaultValue={row?.title} name="title" placeholder="مثلا گمرک" />
        </FieldShell>
        <FieldShell label="آدرس انگلیسی">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="customs" />
        </FieldShell>
        <FieldShell label="دسته والد">
          <AdminDropdown
            defaultValue={row?.parentId ?? ""}
            disabled={disabled}
            emptyLabel="دسته‌ای پیدا نشد"
            name="parentId"
            options={[
              { label: "دسته اصلی", value: "" },
              ...categoryOptions.filter((item) => item.id !== row?.id).map((item) => ({
                group: item.parentTitle || "دسته‌های اصلی",
                label: item.title,
                value: item.id
              }))
            ]}
            placeholder="انتخاب دسته والد"
            searchable
          />
        </FieldShell>
        <FieldShell label="نوع دسته">
          <ChoiceInput disabled={disabled} defaultValue={row?.type ?? "encyclopedia"} name="type" options={categoryTypeOptions} />
        </FieldShell>
        <FieldShell label="ترتیب نمایش">
          <TextInput disabled={disabled} defaultValue={row?.sortOrder ?? 0} dir="ltr" name="sortOrder" placeholder="10" />
        </FieldShell>
        <FieldShell label="Canonical URL">
          <TextInput disabled={disabled} defaultValue={row?.canonicalUrl ?? ""} dir="ltr" name="canonicalUrl" placeholder="/trade-encyclopedia/customs" />
        </FieldShell>
      </div>
      <div className="admin-form-balanced-grid">
        <FieldShell label="توضیح کوتاه">
          <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.summary ?? ""} maxLength={500} name="summary" placeholder="توضیح کوتاه صفحه دسته‌بندی" rows={4} />
        </FieldShell>
        <div className="admin-form-field-stack">
          <FieldShell label="عنوان SEO">
            <TextInput disabled={disabled} defaultValue={row?.seoTitle ?? ""} name="seoTitle" />
          </FieldShell>
          <FieldShell label="تصویر شاخص">
            <TextInput disabled={disabled} defaultValue={row?.coverImageUrl ?? ""} dir="ltr" name="coverImageUrl" placeholder="/images/categories/customs.jpg" />
          </FieldShell>
        </div>
      </div>
      <div className="admin-form-grid">
        <FieldShell label="توضیح SEO">
          <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.seoDescription ?? ""} maxLength={160} name="seoDescription" placeholder="توضیح کوتاه برای نتایج جستجو" rows={4} />
        </FieldShell>
      </div>
      <div className="admin-form-grid two">
        <FieldShell label="محتوای بالای صفحه">
          <TextAreaInput disabled={disabled} defaultValue={row?.contentTop ?? ""} name="contentTop" placeholder="متن معرفی بالای آرشیو مقاله‌ها" rows={6} />
        </FieldShell>
        <FieldShell label="محتوای پایین صفحه">
          <TextAreaInput disabled={disabled} defaultValue={row?.contentBottom ?? ""} name="contentBottom" placeholder="متن تکمیلی پایین صفحه دسته‌بندی" rows={6} />
        </FieldShell>
      </div>
      <div className="admin-form-grid two">
        <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? true} />
        <FieldShell label="وضعیت ایندکس">
          {disabled ? <PublishBadge value={Boolean(row?.isIndexable)} /> : <ChoiceInput disabled={false} defaultValue={String(row?.isIndexable ?? true)} name="isIndexable" options={[{ label: "Noindex", value: "false" }, { label: "قابل ایندکس", value: "true" }]} />}
        </FieldShell>
      </div>
    </AdminFormFrame>
  );
}

function ContentForm({ action, id, resource }: { action: "add" | "view" | "edit"; id?: string; resource: ContentResource }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord(resource, action, id);
  const row = record as AdminContentRecord | null;
  const title = resource === "articles" ? "مقاله" : "خبر";
  const [categoryOptions, setCategoryOptions] = useState<AdminCategoryRecord[]>([]);

  useEffect(() => {
    loadAdminLookup("categories")
      .then(({ response: { items } }) => setCategoryOptions((items as AdminCategoryRecord[]).filter((item) => item.accuracy !== 2)))
      .catch(() => setCategoryOptions([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord(resource, action === "edit" ? "update" : "add", {
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
      });
      toast.success(`${title} با موفقیت ذخیره شد.`);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : `ذخیره ${title} ناموفق بود.`);
      throw reason;
    }
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
        <FieldShell label="عنوان SEO">
          <TextInput disabled={disabled} defaultValue={row?.seoTitle} name="seoTitle" />
        </FieldShell>
      </div>
      <div className="admin-form-balanced-grid">
        <FieldShell label="توضیح SEO">
          <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.seoDescription} maxLength={160} name="seoDescription" placeholder="توضیح کوتاه محتوا برای نمایش در نتایج جستجو" rows={4} />
        </FieldShell>
        <div className="admin-form-field-stack">
          <FieldShell label="دسته‌بندی">
            <AdminDropdown
              defaultValue={row?.categoryId ?? ""}
              disabled={disabled}
              emptyLabel="دسته‌بندی‌ای پیدا نشد"
              name="categoryId"
              options={[
                { label: "بدون دسته‌بندی", value: "" },
                ...categoryOptions.map((item) => ({
                  group: item.parentTitle || "دسته‌های اصلی",
                  label: item.title,
                  value: item.id
                }))
              ]}
              placeholder="انتخاب دسته‌بندی"
              searchable
            />
          </FieldShell>
          <FieldShell label={`تگ‌های ${title}`}>
            <TagPicker disabled={disabled} selectedIds={row?.tagIds ?? []} />
          </FieldShell>
        </div>
      </div>
      <div className="admin-form-grid two">
        <FieldShell label="تایید محتوا">
          {disabled ? <BooleanBadge falseLabel="در انتظار تایید" trueLabel="تایید شده" value={Boolean(row?.approve)} /> : <ChoiceInput disabled={false} defaultValue={String(row?.approve ?? false)} name="approve" options={approveOptions} />}
        </FieldShell>
        <FieldShell label="زمان‌بندی انتشار">
          <DateTextInput disabled={disabled} defaultValue={row?.scheduledAt ?? ""} name="scheduledAt" placeholder="2026-06-25 09:00:00" />
        </FieldShell>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? false} />
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
  const title = resource === "services" ? "خدمت" : resource === "pages" ? "صفحه" : "تگ";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord(resource, action === "edit" ? "update" : "add", {
        id: row?.id,
        title: form.get("title"),
        slug: form.get("slug"),
        summary: form.get("summary"),
        content: form.get("content"),
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        cta: form.get("cta"),
        isPublished: toBoolean(form.get("isPublished")),
        accuracy: Number(form.get("accuracy") ?? 0)
      });
      toast.success(`${title} با موفقیت ذخیره شد.`);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : `ذخیره ${title} ناموفق بود.`);
      throw reason;
    }
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource={resource} title={action === "add" ? `ایجاد ${title}` : row?.title ?? title}>
      <div className="admin-form-grid two">
        <FieldShell label="عنوان">
          <TextInput disabled={disabled} defaultValue={row?.title} name="title" placeholder={resource === "services" ? "مثلا ترخیص کالا" : resource === "pages" ? "مثلا خرید از چین" : "مثلا حمل دریایی"} />
        </FieldShell>
        {resource === "services" || resource === "pages" ? (
          <FieldShell label="آدرس انگلیسی">
            <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder={resource === "pages" ? "buy-from-china" : "customs-clearance"} />
          </FieldShell>
        ) : null}
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
      {resource === "pages" ? (
        <>
          <div className="admin-form-balanced-grid">
            <FieldShell label="خلاصه صفحه">
              <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.summary ?? row?.description ?? ""} maxLength={800} name="summary" placeholder="خلاصه کوتاه صفحه برای نمایش در hero و سئو" rows={4} />
            </FieldShell>
            <div className="admin-form-field-stack">
              <FieldShell label="عنوان SEO">
                <TextInput disabled={disabled} defaultValue={row?.seoTitle ?? ""} name="seoTitle" />
              </FieldShell>
              <FieldShell label="توضیح SEO">
                <TextAreaInput disabled={disabled} defaultValue={row?.seoDescription ?? ""} maxLength={160} name="seoDescription" placeholder="توضیح کوتاه برای نتایج جستجو" rows={3} />
              </FieldShell>
            </div>
          </div>
          <section className="admin-form-section">
            <h2>محتوای صفحه</h2>
            <EditorField disabled={disabled} defaultValue={row?.content ?? ""} />
          </section>
        </>
      ) : null}
      {resource === "tags" ? (
        <>
          <div className="admin-form-grid two">
            <FieldShell label="آدرس انگلیسی">
              <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="customs-clearance" />
            </FieldShell>
            <FieldShell label="عنوان SEO">
              <TextInput disabled={disabled} defaultValue={row?.seoTitle ?? ""} name="seoTitle" />
            </FieldShell>
          </div>
          <div className="admin-form-grid">
            <FieldShell label="توضیح SEO">
              <TextAreaInput className="admin-textarea-balanced" disabled={disabled} defaultValue={row?.seoDescription ?? ""} maxLength={160} name="seoDescription" placeholder="توضیح کوتاه صفحه تگ برای نتایج جستجو" rows={4} />
            </FieldShell>
          </div>
          <section className="admin-form-section">
            <h2>محتوای صفحه تگ</h2>
            <EditorField disabled={disabled} defaultValue={row?.content ?? ""} />
          </section>
        </>
      ) : null}
      <StatusFields accuracy={row?.accuracy ?? 0} disabled={disabled} isPublished={row?.isPublished ?? true} withPublish={resource === "services" || resource === "tags" || resource === "pages"} />
    </AdminFormFrame>
  );
}

function WorldClockForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const disabled = action === "view";
  const { error, isLoading, record } = useAdminRecord("world-clocks", action, id);
  const row = record as AdminWorldClockRecord | null;
  const [countries, setCountries] = useState<AdminCountryRecord[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(row?.countryId ?? null);
  const [cityOptions, setCityOptions] = useState<AdminCityOption[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(row?.cityId ?? null);
  const [countryTouched, setCountryTouched] = useState(false);

  useEffect(() => {
    setSelectedCountryId(row?.countryId ?? null);
  }, [row?.countryId]);

  useEffect(() => {
    setSelectedCityId(row?.cityId ?? null);
  }, [row?.cityId]);

  useEffect(() => {
    loadAdminCountries()
      .then(({ response: { items } }) => setCountries(items))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!selectedCountryId) {
      setCityOptions([]);
      return () => {
        mounted = false;
      };
    }

    loadAdminCountryCities(selectedCountryId)
      .then(({ response: { items } }) => {
        if (!mounted) return;
        setCityOptions(items);

        const currentRecordCityId = !countryTouched && row?.countryId === selectedCountryId ? row?.cityId : null;
        const hasCurrentCity = items.some((item) => item.id === currentRecordCityId);
        setSelectedCityId(hasCurrentCity ? currentRecordCityId ?? null : null);
      })
      .catch(() => {
        setCityOptions([]);
        setSelectedCityId(null);
      });

    return () => {
      mounted = false;
    };
  }, [countryTouched, row?.cityId, row?.countryId, selectedCountryId]);

  const selectedCountry = countries.find((country) => country.id === selectedCountryId);
  const selectedCity = cityOptions.find((city) => city.id === selectedCityId);
  const selectedTimezone = selectedCity?.timezone ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);
    const cityId = toNumberOrNull(form.get("cityId"));
    const cityOption = cityOptions.find((option) => option.id === cityId);

    if (!selectedCountryId || !cityOption) {
      toast.error("لطفاً کشور و شهر را انتخاب کنید.");
      throw new Error("Country and city are required.");
    }

    const save = () => saveAdminRecord("world-clocks", action === "edit" ? "update" : "add", {
      id: row?.id,
      countryId: toNumberOrNull(form.get("countryId")),
      cityId,
      city: cityOption.city,
      country: form.get("country"),
      countryCode: form.get("countryCode"),
      continent: form.get("continent"),
      timezone: cityOption.timezone,
      marketLabel: form.get("marketLabel"),
      sortOrder: Number(form.get("sortOrder") ?? 0),
      accuracy: Number(form.get("accuracy") ?? 0),
      isPublished: toBoolean(form.get("isPublished"))
    })
      .then(() => toast.success("ساعت جهانی با موفقیت ذخیره شد."))
      .catch((reason: unknown) => {
        toast.error(reason instanceof Error ? reason.message : "ذخیره ساعت جهانی ناموفق بود.");
        throw reason;
      });

    if (action === "add") {
      let activeCount = 0;

      try {
        const { response: { items } } = await loadAdminPage("world-clocks");
        activeCount = items.filter((item) => item.accuracy !== 2).length;
      } catch {
        activeCount = 0;
      }

      if (activeCount >= 7) {
        toast.error("برای ساعت جهانی حداکثر ۷ شهر قابل نمایش است.");
        throw new Error("World clock limit reached.");
      }
    }

    await save();
  }

  if (isLoading) return <section className="admin-empty-state"><strong>در حال دریافت داده...</strong></section>;
  if (error) return <section className="admin-empty-state"><strong>خطا</strong><p>{error}</p></section>;

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="world-clocks" title={action === "add" ? "ایجاد ساعت جهانی" : row?.city ?? "ساعت جهانی"}>
      <div className="admin-form-grid two">
        <FieldShell label="کشور">
          <div className="admin-select-stack">
            <AdminDropdown
              disabled={disabled || countries.length === 0}
              emptyLabel="کشوری با این عبارت پیدا نشد"
              name="countryId"
              onChange={(nextValue) => {
                const nextCountryId = toNumberOrNull(Array.isArray(nextValue) ? nextValue[0] : nextValue) as number | null;
                setCountryTouched(true);
                setSelectedCountryId(nextCountryId);
                setCityOptions([]);
                setSelectedCityId(null);
              }}
              options={countries.map((country) => ({
                group: country.continent || "Other",
                label: `${country.nameFa} (${country.iso2})`,
                value: country.id
              }))}
              placeholder="انتخاب کشور"
              searchable
              value={selectedCountryId ?? row?.countryId ?? ""}
            />
            <input name="country" type="hidden" value={selectedCountry?.nameFa ?? row?.country ?? ""} />
            <input name="countryCode" type="hidden" value={selectedCountry?.iso2 ?? row?.countryCode ?? ""} />
            <input name="continent" type="hidden" value={selectedCountry?.continent ?? row?.continent ?? ""} />
            {countries.length === 0 ? <span className="admin-chip-empty">کشوری برای انتخاب آماده نیست</span> : null}
          </div>
        </FieldShell>
        <FieldShell label="شهر">
          <AdminDropdown
            disabled={disabled || !selectedCountryId}
            emptyLabel="شهری برای این کشور آماده نیست"
            name="cityId"
            onChange={(nextValue) => {
              const nextCityId = toNumberOrNull(Array.isArray(nextValue) ? nextValue[0] : nextValue);
              setSelectedCityId(nextCityId);
            }}
            options={cityOptions.map((option) => ({
              label: `${option.city} - ${option.cityEn} | ${option.timezone}`,
              value: option.id
            }))}
            placeholder="انتخاب شهر"
            searchable
            value={selectedCityId ?? ""}
          />
          <input name="city" type="hidden" value={selectedCity?.city ?? ""} />
          <input name="timezone" type="hidden" value={selectedTimezone} />
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

function ContentSourceForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const [row, setRow] = useState<AdminContentSourceRecord | null>(null);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const disabled = action === "view";

  useEffect(() => {
    loadAdminLookup("categories", { accuracy: 1 })
      .then(({ response: { items } }) => setCategories(items as AdminCategoryRecord[]))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id || action === "add") return;
    findAdminRecord("content-sources", id)
      .then(({ response: { items } }) => setRow((items[0] as AdminContentSourceRecord | undefined) ?? null))
      .catch(() => toast.error("دریافت منبع ناموفق بود."));
  }, [action, id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord("content-sources", action === "edit" ? "update" : "add", {
        id: row?.id,
        name: form.get("name"),
        slug: form.get("slug"),
        websiteUrl: form.get("websiteUrl"),
        feedUrl: form.get("feedUrl"),
        sourceType: form.get("sourceType"),
        sourceCategory: form.get("sourceCategory"),
        language: form.get("language"),
        country: form.get("country"),
        defaultArticleType: form.get("defaultArticleType"),
        defaultCategoryId: toNumberOrNull(form.get("defaultCategoryId")),
        trustLevel: form.get("trustLevel"),
        fetchIntervalMinutes: toNumberOrNull(form.get("fetchIntervalMinutes")) ?? 60,
        backfillDays: toNumberOrNull(form.get("backfillDays")) ?? 7,
        maxBackfillItems: toNumberOrNull(form.get("maxBackfillItems")) ?? 20,
        requiresReview: true,
        allowAutoPublish: false,
        isActive: toBoolean(form.get("isActive")),
        respectRobots: toBoolean(form.get("respectRobots")),
        connectionStatus: form.get("connectionStatus"),
        termsNotes: form.get("termsNotes"),
        parserKey: form.get("parserKey"),
        accuracy: toNumberOrNull(form.get("accuracy")) ?? 1
      });
      toast.success("منبع ذخیره شد.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "ذخیره منبع ناموفق بود.");
      throw reason;
    }
  }

  const categoryOptions = categories.map((category) => ({
    group: category.type,
    label: category.parentTitle ? `${category.parentTitle} / ${category.title}` : category.title,
    value: category.id
  }));

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="content-sources" title={action === "add" ? "ایجاد منبع خبری" : row?.name ?? "منبع خبری"}>
      <div className="admin-form-grid two">
        <FieldShell label="نام منبع">
          <TextInput disabled={disabled} defaultValue={row?.name} name="name" placeholder="خبرگزاری یا منبع رسمی" />
        </FieldShell>
        <FieldShell label="اسلاگ">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" placeholder="tasnim-news" />
        </FieldShell>
        <FieldShell label="آدرس سایت">
          <TextInput disabled={disabled} defaultValue={row?.websiteUrl} dir="ltr" name="websiteUrl" placeholder="https://example.com" />
        </FieldShell>
        <FieldShell label="آدرس فید یا API">
          <TextInput disabled={disabled} defaultValue={row?.feedUrl} dir="ltr" name="feedUrl" placeholder="بدون حدس URL" />
        </FieldShell>
        <FieldShell label="نوع اتصال">
          <ChoiceInput disabled={disabled} defaultValue={row?.sourceType ?? "manual"} name="sourceType" options={[
            { label: "RSS", value: "rss" },
            { label: "Atom", value: "atom" },
            { label: "API", value: "api" },
            { label: "Scraper", value: "scraper" },
            { label: "Manual", value: "manual" }
          ]} />
        </FieldShell>
        <FieldShell label="گروه منبع">
          <ChoiceInput disabled={disabled} defaultValue={row?.sourceCategory ?? "official"} name="sourceCategory" options={[
            { label: "رسمی", value: "official" },
            { label: "خبرگزاری", value: "news_agency" },
            { label: "رسانه تجاری", value: "trade_media" },
            { label: "بین‌المللی", value: "international" }
          ]} />
        </FieldShell>
        <FieldShell label="زبان">
          <TextInput disabled={disabled} defaultValue={row?.language ?? "fa"} dir="ltr" name="language" placeholder="fa" />
        </FieldShell>
        <FieldShell label="کشور">
          <TextInput disabled={disabled} defaultValue={row?.country ?? "IR"} dir="ltr" name="country" placeholder="IR" />
        </FieldShell>
        <FieldShell label="نوع محتوای پیش‌فرض">
          <ChoiceInput disabled={disabled} defaultValue={row?.defaultArticleType ?? "news"} name="defaultArticleType" options={[
            { label: "خبر", value: "news" },
            { label: "بخشنامه", value: "circular" },
            { label: "مقرره", value: "regulation" },
            { label: "اطلاعیه رسمی", value: "official_notice" }
          ]} />
        </FieldShell>
        <FieldShell label="دسته پیش‌فرض">
          <ChoiceInput disabled={disabled} defaultValue={row?.defaultCategoryId ?? ""} name="defaultCategoryId" options={[{ label: "بدون دسته", value: "" }, ...categoryOptions]} searchable />
        </FieldShell>
        <FieldShell label="سطح اعتماد">
          <ChoiceInput disabled={disabled} defaultValue={row?.trustLevel ?? "medium"} name="trustLevel" options={[
            { label: "رسمی", value: "official" },
            { label: "بالا", value: "high" },
            { label: "متوسط", value: "medium" },
            { label: "پایین", value: "low" }
          ]} />
        </FieldShell>
        <FieldShell label="وضعیت اتصال">
          <ChoiceInput disabled={disabled} defaultValue={row?.connectionStatus ?? "needs_configuration"} name="connectionStatus" options={[
            { label: "آماده", value: "ready" },
            { label: "نیازمند تنظیم", value: "needs_configuration" },
            { label: "ورود دستی لازم است", value: "manual_required" },
            { label: "غیرفعال", value: "disabled" },
            { label: "خطادار", value: "error" }
          ]} />
        </FieldShell>
        <FieldShell label="فاصله بررسی (دقیقه)">
          <TextInput disabled={disabled} defaultValue={row?.fetchIntervalMinutes ?? 60} dir="ltr" name="fetchIntervalMinutes" />
        </FieldShell>
        <FieldShell label="حداکثر Backfill">
          <TextInput disabled={disabled} defaultValue={row?.maxBackfillItems ?? 20} dir="ltr" name="maxBackfillItems" />
        </FieldShell>
        <FieldShell label="روزهای Backfill">
          <TextInput disabled={disabled} defaultValue={row?.backfillDays ?? 7} dir="ltr" name="backfillDays" />
        </FieldShell>
        <FieldShell label="Parser Key">
          <TextInput disabled={disabled} defaultValue={row?.parserKey ?? "rss-generic"} dir="ltr" name="parserKey" />
        </FieldShell>
        <FieldShell label="فعال">
          <ChoiceInput disabled={disabled} defaultValue={String(Boolean(row?.isActive))} name="isActive" options={publishOptions} />
        </FieldShell>
        <FieldShell label="رعایت Robots/Terms">
          <ChoiceInput disabled={disabled} defaultValue={String(row?.respectRobots ?? true)} name="respectRobots" options={publishOptions} />
        </FieldShell>
      </div>
      <FieldShell label="یادداشت شرایط استفاده و محدودیت‌ها">
        <textarea defaultValue={row?.termsNotes ?? ""} disabled={disabled} name="termsNotes" rows={4} />
      </FieldShell>
      <StatusFields accuracy={row?.accuracy ?? 1} disabled={disabled} withPublish={false} />
    </AdminFormFrame>
  );
}

function SourceItemForm({ action, id }: { action: "add" | "view" | "edit"; id?: string }) {
  const [row, setRow] = useState<AdminSourceItemRecord | null>(null);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const disabled = action === "view";

  useEffect(() => {
    loadAdminLookup("categories", { accuracy: 1 })
      .then(({ response: { items } }) => setCategories(items as AdminCategoryRecord[]))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id || action === "add") return;
    findAdminRecord("source-items", id)
      .then(({ response: { items } }) => setRow((items[0] as AdminSourceItemRecord | undefined) ?? null))
      .catch(() => toast.error("دریافت خبر ورودی ناموفق بود."));
  }, [action, id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);

    try {
      await saveAdminRecord("source-items", "update", {
        id: row?.id,
        reviewTitle: form.get("reviewTitle"),
        slug: form.get("slug"),
        summary: form.get("summary"),
        content: form.get("content"),
        detectedContentType: form.get("detectedContentType"),
        suggestedCategoryId: toNumberOrNull(form.get("suggestedCategoryId")),
        processingStatus: form.get("processingStatus"),
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        selectedImageUrl: form.get("selectedImageUrl"),
        circularNumber: form.get("circularNumber"),
        issuer: form.get("issuer"),
        effectiveAt: form.get("effectiveAt"),
        validityStatus: form.get("validityStatus"),
        accuracy: toNumberOrNull(form.get("accuracy")) ?? 1
      });
      toast.success("آیتم ورودی ذخیره شد.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "ذخیره آیتم ورودی ناموفق بود.");
      throw reason;
    }
  }

  const categoryOptions = categories.map((category) => ({
    group: category.type,
    label: category.parentTitle ? `${category.parentTitle} / ${category.title}` : category.title,
    value: category.id
  }));

  return (
    <AdminFormFrame action={action} id={row?.id} onSubmit={handleSubmit} resource="source-items" title={row?.originalTitle ?? "خبر ورودی"}>
      {row ? (
        <section className="admin-empty-state">
          <strong>اطلاعات منبع</strong>
          <p>{row.sourceName} | {formatPersianDateTime(row.sourcePublishedAt) || "بدون تاریخ"} | <a href={row.sourceUrl} rel="noreferrer" target="_blank">مشاهده منبع اصلی</a></p>
          <p>{row.originalSummary || "خلاصه‌ای از منبع دریافت نشده است."}</p>
        </section>
      ) : null}
      <div className="admin-form-grid two">
        <FieldShell label="عنوان قابل انتشار">
          <TextInput disabled={disabled} defaultValue={row?.reviewTitle ?? row?.originalTitle} name="reviewTitle" />
        </FieldShell>
        <FieldShell label="Slug">
          <TextInput disabled={disabled} defaultValue={row?.slug} dir="ltr" name="slug" />
        </FieldShell>
        <FieldShell label="نوع محتوا">
          <ChoiceInput disabled={disabled} defaultValue={row?.detectedContentType ?? "news"} name="detectedContentType" options={[
            { label: "خبر", value: "news" },
            { label: "بخشنامه", value: "circular" },
            { label: "مقرره", value: "regulation" },
            { label: "اطلاعیه رسمی", value: "official_notice" }
          ]} />
        </FieldShell>
        <FieldShell label="دسته پیشنهادی/نهایی">
          <ChoiceInput disabled={disabled} defaultValue={row?.suggestedCategoryId ?? ""} name="suggestedCategoryId" options={[{ label: "بدون دسته", value: "" }, ...categoryOptions]} searchable />
        </FieldShell>
        <FieldShell label="وضعیت بررسی">
          <ChoiceInput disabled={disabled} defaultValue={row?.processingStatus ?? "pending_review"} name="processingStatus" options={[
            { label: "در انتظار بررسی", value: "pending_review" },
            { label: "تایید شده", value: "approved" },
            { label: "منتشر شده", value: "published" },
            { label: "رد شده", value: "rejected" },
            { label: "تکراری", value: "duplicate" },
            { label: "بایگانی", value: "archived" },
            { label: "خطادار", value: "failed" },
            { label: "ردشده توسط فیلتر", value: "filtered_out" }
          ]} />
        </FieldShell>
        <FieldShell label="تصویر انتخابی">
          <TextInput disabled={disabled} defaultValue={row?.selectedImageUrl || row?.originalImageUrl} dir="ltr" name="selectedImageUrl" />
        </FieldShell>
        <FieldShell label="شماره بخشنامه">
          <TextInput disabled={disabled} defaultValue={row?.circularNumber} name="circularNumber" />
        </FieldShell>
        <FieldShell label="مرجع صادرکننده">
          <TextInput disabled={disabled} defaultValue={row?.issuer} name="issuer" />
        </FieldShell>
        <FieldShell label="تاریخ اجرا">
          <DateTextInput disabled={disabled} defaultValue={row?.effectiveAt} name="effectiveAt" />
        </FieldShell>
        <FieldShell label="وضعیت اعتبار">
          <TextInput disabled={disabled} defaultValue={row?.validityStatus} name="validityStatus" />
        </FieldShell>
      </div>
      <FieldShell label="خلاصه قابل انتشار">
        <textarea defaultValue={row?.summary || row?.originalSummary} disabled={disabled} name="summary" rows={4} />
      </FieldShell>
      <FieldShell label="متن قابل انتشار">
        <EditorField defaultValue={row?.content || row?.originalContent} disabled={disabled} />
      </FieldShell>
      <div className="admin-form-grid two">
        <FieldShell label="SEO Title">
          <TextInput disabled={disabled} defaultValue={row?.seoTitle} name="seoTitle" />
        </FieldShell>
        <FieldShell label="SEO Description">
          <TextInput disabled={disabled} defaultValue={row?.seoDescription} name="seoDescription" />
        </FieldShell>
      </div>
      <StatusFields accuracy={row?.accuracy ?? 1} disabled={disabled} withPublish={false} />
    </AdminFormFrame>
  );
}

export function AdminResourceActionPage({ action, id, resource }: AdminResourceActionPageProps) {
  const supported = useMemo(() => ["menus", "categories", "pages", "services", "articles", "news", "tags", "world-clocks", "content-sources", "source-items"].includes(resource), [resource]);

  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-page-heading">
          <span>{actionLabels[action]}</span>
          <h1>{actionLabels[action]} {resource}</h1>
          <p>فرم مدیریت این بخش به سرویس بک‌اند متصل است و داده فیک نمایش نمی‌دهد.</p>
        </section>

        {resource === "menus" ? <MenuForm action={action} id={id} /> : null}
        {resource === "categories" ? <CategoryForm action={action} id={id} /> : null}
        {resource === "articles" || resource === "news" ? <ContentForm action={action} id={id} resource={resource} /> : null}
        {resource === "tags" || resource === "services" || resource === "pages" ? <SimpleForm action={action} id={id} resource={resource} /> : null}
        {resource === "world-clocks" ? <WorldClockForm action={action} id={id} /> : null}
        {resource === "content-sources" ? <ContentSourceForm action={action} id={id} /> : null}
        {resource === "source-items" ? <SourceItemForm action={action} id={id} /> : null}
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
