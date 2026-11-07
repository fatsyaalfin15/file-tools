type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export default function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: Props<T>) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className={`flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition sm:text-sm ${
                selected
                  ? "bg-white text-orange-700 shadow dark:bg-slate-700 dark:text-orange-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
