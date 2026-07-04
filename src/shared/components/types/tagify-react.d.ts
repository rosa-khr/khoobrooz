declare module "@yaireo/tagify/dist/react.tagify" {
  import type { ComponentType } from "react";

  type TagifyChangeEvent = {
    detail: {
      value: string;
    };
  };

  type TagifyProps = {
    className?: string;
    defaultValue?: string | unknown[];
    disabled?: boolean;
    name?: string;
    onChange?: (event: TagifyChangeEvent) => void;
    placeholder?: string;
    readOnly?: boolean;
    settings?: Record<string, unknown>;
    value?: string | unknown[];
    whitelist?: unknown[];
  };

  const Tags: ComponentType<TagifyProps>;
  export default Tags;
}
