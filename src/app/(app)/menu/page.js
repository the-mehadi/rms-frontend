"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { HoverLift } from "@/components/motion/HoverLift";
import { cn } from "@/lib/utils";
import { MENU_ADMIN_ITEMS, MENU_CATEGORIES } from "@/lib/mock/menu-admin";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  MoreVerticalIcon,
  SearchIcon,
  UploadCloudIcon,
  PencilIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { categoriesAPI } from "@/lib/api/categories";
import { menuItemsAPI } from "@/lib/api/menuItems";
import { toast } from "sonner";

function CategoryTabs({ value, onChange, onAddCategory, categories = [] }) {
  const allCategories = ["All", ...categories.map(c => c.name)];
  
  return (
    <div className="relative overflow-x-auto">
      <div className="flex w-max items-center gap-2 mb-4">
        {allCategories.map((c) => {
          const active = value === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn(
                "relative rounded-full border px-4 py-2 text-xs font-semibold transition",
                active
                  ? "bg-rms-gradient text-white border-transparent shadow-glow"
                  : "bg-background/40 hover:bg-muted"
              )}
            >
              {c}
              {active ? (
                <span className="pointer-events-none absolute -bottom-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-rms-gradient" />
              ) : null}
            </button>
          );
        })}

        <button 
          onClick={onAddCategory}
          className="rounded-full border bg-background/40 px-4 py-2 text-xs font-semibold transition hover:bg-muted"
        >
          + Category
        </button>
      </div>
    </div>
  );
}

function CategoryModal({ open, onOpenChange, onSuccess }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setIsActive(true);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      await categoriesAPI.create({
        name,
        description,
        is_active: isActive
      });
      
      toast.success("Category created successfully");
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      
      // Handle validation errors from backend if they exist
      const errorMessage = error.response?.data?.message || "Failed to create category. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] rounded-4xl">
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Category name
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Desserts"
              className="h-11 rounded-2xl focus-lux"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Description
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the category…"
              className="min-h-24 rounded-2xl focus-lux"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">Active status</div>
              <div className="text-xs text-muted-foreground">
                Visible in the menu selection
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} disabled={loading} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="h-11 rounded-2xl" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {loading ? "Creating..." : "Create category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ItemModal({ open, onOpenChange, mode, initial, categories = [], onSuccess }) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [price, setPrice] = React.useState(initial?.price ?? "");
  const [categoryId, setCategoryId] = React.useState(initial?.category_id ?? "");
  const [desc, setDesc] = React.useState(initial?.description ?? "");
  const [isAvailable, setIsAvailable] = React.useState(initial?.is_available ?? true);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setPrice(initial?.price ?? "");
    setCategoryId(initial?.category_id ?? "");
    setDesc(initial?.description ?? "");
    setIsAvailable(initial?.is_available ?? true);
    setImages([]);
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!name.trim() || !price || !categoryId) {
      toast.error("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category_id", categoryId);
      formData.append("description", desc);
      formData.append("is_available", isAvailable ? 1 : 0);
      
      images.forEach((img) => {
        formData.append("images[]", img);
      });

      if (mode === "edit" && initial?.id) {
        // Implement update later if needed
        toast.info("Update functionality not yet implemented");
      } else {
        await menuItemsAPI.create(formData);
        toast.success("Menu item created successfully");
      }

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save menu item:", error);
      const errorMessage = error.response?.data?.message || "Failed to save menu item. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] rounded-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit item" : "Add new item"}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className="rounded-3xl border bg-muted/20 p-4">
            <div className="text-xs font-semibold text-muted-foreground">
              Image upload (Multiple)
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              disabled={loading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 w-full grid place-items-center rounded-3xl border bg-background/40 p-8 text-center transition hover:bg-background/60"
              disabled={loading}
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-rms-gradient text-white shadow-glow">
                <UploadCloudIcon className="size-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">
                {images.length > 0 ? `${images.length} files selected` : "Click to upload images"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Support for JPG, PNG, WEBP
              </div>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">
                Name <span className="text-rose-500">*</span>
              </div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Truffle Pasta"
                className="h-11 rounded-2xl focus-lux"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">
                Price <span className="text-rose-500">*</span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ৳
                </span>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="990"
                  className="h-11 rounded-2xl pl-8 focus-lux"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Category <span className="text-rose-500">*</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition",
                    categoryId === c.id
                      ? "bg-rms-gradient text-white border-transparent shadow-glow"
                      : "bg-background/40 hover:bg-muted"
                  )}
                  disabled={loading}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Description
            </div>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of the menu item…"
              className="min-h-24 rounded-2xl focus-lux"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">Availability status</div>
              <div className="text-xs text-muted-foreground">
                Show or hide this item in the menu
              </div>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} disabled={loading} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="h-11 rounded-2xl" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : "Save Item"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ItemCard({ item, onEdit }) {
  return (
    <HoverLift lift={3} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-3xl border bg-background/40">
        <div className="aspect-4/3 w-full overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(240px_160px_at_20%_0%,rgba(255,107,53,0.28)_0%,transparent_60%),radial-gradient(240px_160px_at_95%_20%,rgba(99,102,241,0.18)_0%,transparent_55%)] transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/25 opacity-70 transition-opacity group-hover:opacity-90" />
        </div>

        <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="size-10 rounded-2xl"
            onClick={() => onEdit(item)}
          >
            <PencilIcon className="size-4" />
          </Button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{item.name}</div>
              <div className="mt-1 text-sm font-semibold text-rms-gradient">
                {formatCurrency(item.price, "BDT")}
              </div>
            </div>
            <Badge className="rounded-full bg-amber-500/12 text-white-900 dark:text-white-300">{item.category ? item.categoryName : "N/A"}</Badge>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-muted-foreground">
              Availability
            </div>
            <Switch checked={item.available ?? item.is_available} />
          </div>
        </div>
      </div>
    </HoverLift>
  );
}

export default function MenuAdminPage() {
  const [category, setCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [items, setItems] = React.useState([]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.data.items);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const fetchItems = React.useCallback(async () => {
    try {
      const data = await menuItemsAPI.getAll();
      setItems(data.data.items);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      toast.error("Failed to load menu items");
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getCategoryNameById = React.useCallback(
    (id) => categories.find((c) => c.id === id)?.name ?? undefined,
    [categories]
  );

  const filtered = React.useMemo(() => {
    const normalized = items.map((it) => ({
      ...it,
      categoryName: getCategoryNameById(it.category_id),
      available: it.is_available,
    }));
    return normalized.filter((it) => {
      const inCategory =
        category === "All" || it.categoryName === category;
      const inQuery =
        query.trim() === "" ||
        it.name.toLowerCase().includes(query.trim().toLowerCase());
      return inCategory && inQuery;
    });
  }, [items, category, query, getCategoryNameById]);

  return (
    <PageTransition className="space-y-6">
      <div className="glass lux-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Menu management</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Admin tools • edit items • categories
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
                className="h-11 w-full rounded-2xl pl-10 sm:w-[320px] focus-lux"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="h-11 rounded-2xl">
                  Bulk actions <MoreVerticalIcon className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>Mark available</DropdownMenuItem>
                <DropdownMenuItem disabled>Mark unavailable</DropdownMenuItem>
                <DropdownMenuItem disabled className="text-rose-600">
                  <Trash2Icon className="mr-2 size-4" />
                  Delete selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow"
              onClick={() => {
                setEditItem(null);
                setOpen(true);
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              Add new item
            </Button>
          </div>
        </div>

        <Separator className="my-5" />

        <CategoryTabs 
          value={category} 
          onChange={setCategory} 
          onAddCategory={() => setCategoryOpen(true)}
          categories={categories}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((it) => (
          <ItemCard
            key={it.id}
            item={it}
            onEdit={(item) => {
              setEditItem(item);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <ItemModal
        open={open}
        onOpenChange={setOpen}
        mode={editItem ? "edit" : "create"}
        initial={editItem}
        categories={categories}
        onSuccess={fetchItems}
      />

      <CategoryModal 
        open={categoryOpen}
        onOpenChange={setCategoryOpen}
        onSuccess={fetchCategories}
      />
    </PageTransition>
  );
}

