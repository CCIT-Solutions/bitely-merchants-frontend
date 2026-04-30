import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, X, ChevronDown, XIcon, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-[2px] hover:scale-105 duration-300",
  {
    variants: {
      variant: {
        default: "text-background bg-primary hover:bg-primary/95",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Accessible label for the multi-select component.
   * Used by screen readers to describe the purpose of the component.
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels the multi-select component.
   * Alternative to aria-label when you have a visible label element.
   */
  "aria-labelledby"?: string;

  /**
   * ID of an element that describes the multi-select component.
   * Provides additional context beyond the label.
   */
  "aria-describedby"?: string;

  texts?: {
    noResult: string;
    clear: string;
    close: string;
    search: string;
    selectAll: string;
  };
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 100,
      modalPopover = false,
      asChild = false,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      texts = {
        noResult: "No results found.",
        clear: "Clear",
        close: "Close",
        search: "Search..",
        selectAll: "Select all",
      },
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Generate unique IDs for ARIA relationships
    const comboboxId = React.useId();
    const listboxId = React.useId();
    const searchInputId = React.useId();

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    // Create accessible description of selected items
    const getSelectedItemsDescription = () => {
      if (selectedValues.length === 0) return "No items selected";
      if (selectedValues.length === 1) {
        const option = options.find((o) => o.value === selectedValues[0]);
        return `1 item selected: ${option?.label}`;
      }
      if (selectedValues.length <= maxCount) {
        const labels = selectedValues
          .map((value) => options.find((o) => o.value === value)?.label)
          .filter(Boolean)
          .join(", ");
        return `${selectedValues.length} items selected: ${labels}`;
      }
      return `${selectedValues.length} items selected, showing first ${maxCount}`;
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            id={comboboxId}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-9 h-auto items-center justify-between bg-inherit hover:bg-inherit",
              className
            )}
            role="combobox"
            aria-expanded={isPopoverOpen}
            aria-haspopup="listbox"
            aria-controls={isPopoverOpen ? listboxId : undefined}
            aria-label={
              ariaLabel || 
              `Multi-select combobox, ${getSelectedItemsDescription()}`
            }
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            asChild={asChild}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant }),
                          "p-1"
                        )}
                        style={{ animationDuration: `${animation}s` }}
                        role="listitem"
                        aria-label={`Selected: ${option?.label}`}
                      >
                        {IconComponent && (
                          <IconComponent className="size-4 mr-2" aria-hidden="true" />
                        )}
                        {option?.color ? (
                          <div
                            className={"rounded-lg flex gap-1 items-center"}
                            title={`${option.label}`}
                          >
                            <div
                              className={`size-4 rounded-sm block ring-ring ring-1`}
                              style={{ backgroundColor: option.color }}
                              aria-hidden="true"
                            ></div>
                          </div>
                        ) : (
                          <span>{option?.label}</span>
                        )}
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                          variant={"noStyle"}
                          className="p-0 bg-none hover:bg-none h-auto ml-1 has-[>svg]:px-0 size-3"
                          aria-label={`Remove ${option?.label}`}
                          tabIndex={-1}
                        >
                          <X className="cursor-pointer size-full" aria-hidden="true" />
                        </Button>
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        isAnimating ? "animate-bounce" : "",
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                      role="listitem"
                      aria-label={`${selectedValues.length - maxCount} more items selected`}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                        variant={"noStyle"}
                        className="p-0 bg-none hover:bg-none h-auto"
                        aria-label="Remove extra selections"
                        tabIndex={-1}
                      >
                        <X className="ml-2 size-4 cursor-pointer" aria-hidden="true" />
                      </Button>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                    variant={"noStyle"}
                    className="p-0 bg-none hover:bg-none h-auto"
                    aria-label="Clear all selections"
                    tabIndex={-1}
                  >
                    <XIcon className="h-4 mx-2 cursor-pointer text-muted-foreground" aria-hidden="true" />
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="flex min-h-6 h-full"
                    aria-hidden="true"
                  />
                  <ChevronDown 
                    className="h-4 mx-2 cursor-pointer text-muted-foreground" 
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown 
                  className="h-4 cursor-pointer text-muted-foreground mx-2" 
                  aria-hidden="true"
                />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-full"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          role="dialog"
          aria-label="Select options"
        >
          <Command>
            <CommandInput
              id={searchInputId}
              placeholder={texts.search}
              onKeyDown={handleInputKeyDown}
              aria-label="Search options"
              role="searchbox"
              aria-controls={listboxId}
            />
            <CommandList
              id={listboxId}
              className="max-h-[350px] overflow-y-auto w-[85vw] md:w-[535px]"
              onWheel={(e) => e.stopPropagation()}
              role="listbox"
              aria-multiselectable="true"
              aria-label="Available options"
            >
              <CommandEmpty role="status">{texts.noResult}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                  role="option"
                  aria-selected={selectedValues.length === options.length}
                  aria-label={`${texts.selectAll} (${selectedValues.length === options.length ? 'all selected' : 'select all'})`}
                >
                  <div
                    className={cn(
                      "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === options.length
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                    aria-hidden="true"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>{texts.selectAll}</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${option.label} ${isSelected ? '(selected)' : '(not selected)'}`}
                    >
                      <div
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                        aria-hidden="true"
                      >
                        <CheckIcon className="size-2 text-background" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 size-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      {option?.color ? (
                        <div className={"rounded-lg flex gap-1 items-center"}>
                          <div
                            className={`size-4 rounded-sm block ring-ring ring-1`}
                            style={{ backgroundColor: option.color }}
                            aria-hidden="true"
                          ></div>
                          <span>{option.label}</span>
                        </div>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator aria-hidden="true" />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                        role="button"
                        aria-label="Clear all selections"
                      >
                        <Button className="w-full" variant={"outline"}>
                          {texts.clear}
                        </Button>
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                        aria-hidden="true"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full px-2"
                    role="button"
                    aria-label="Close options menu"
                  >
                    <Button className="w-full" variant={"default"}>
                      {texts.close}
                    </Button>
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
              isAnimating ? "" : "text-muted-foreground"
            )}
            onClick={() => setIsAnimating(!isAnimating)}
            role="button"
            aria-label={`Toggle animation ${isAnimating ? 'off' : 'on'}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsAnimating(!isAnimating);
              }
            }}
          />
        )}
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";