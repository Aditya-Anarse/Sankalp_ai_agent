"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding, ProductItem } from "@/context/OnboardingContext";
import { Plus, Trash2, Tag, ShoppingBag, DollarSign, Sparkles, Image as ImageIcon } from "lucide-react";

export default function ProductsStepPage() {
  const router = useRouter();
  const { state, setProducts, setCurrentStep } = useOnboarding();

  const [products, setLocalProducts] = useState<ProductItem[]>(
    state.products.length > 0
      ? state.products
      : [
          {
            id: "prod_1",
            name: "Premium Sneakers",
            category: "Footwear",
            price: "₹2,499",
            description: "Everyday lightweight sneakers with responsive comfort sole.",
          },
        ]
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<ProductItem, "id">>({
    name: "",
    category: "General",
    price: "₹1,999",
    description: "",
  });

  const [error, setError] = useState("");

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      setError("Product or service name is required.");
      return;
    }
    if (!newProduct.description.trim()) {
      setError("Product description is required.");
      return;
    }

    const item: ProductItem = {
      ...newProduct,
      id: "prod_" + Date.now().toString(36),
    };

    setLocalProducts([...products, item]);
    setNewProduct({
      name: "",
      category: "General",
      price: "₹1,999",
      description: "",
    });
    setIsAdding(false);
    setError("");
  };

  const handleDeleteProduct = (id: string) => {
    if (products.length <= 1) {
      setError("You must have at least one product or service in your catalog.");
      return;
    }
    setLocalProducts(products.filter((p) => p.id !== id));
    setError("");
  };

  const handleNext = () => {
    if (products.length === 0) {
      setError("Please add at least one product or service for SANKALP to market.");
      return;
    }

    setProducts(products);
    setCurrentStep(3);
    router.push("/onboarding/audience");
  };

  return (
    <OnboardingLayout
      currentStep={2}
      heading="What do you sell?"
      subheading="Give SANKALP the products or services it should promote in campaigns, reels, and product drops."
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Product count header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-300">
              {products.length} {products.length === 1 ? "Product" : "Products"} Added
            </span>
          </div>

          {!isAdding && (
            <button
              onClick={() => {
                setIsAdding(true);
                setError("");
              }}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* Product Cards List */}
        <div className="space-y-3">
          {products.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 flex-shrink-0 group-hover:border-cyan-400/30">
                  <Tag className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-cyan-300">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteProduct(item.id)}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Product Inline Form */}
        {isAdding && (
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Add New Product or Service
              </h4>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setError("");
                }}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <GlassInput
                  label="Product / Service Name"
                  required
                  placeholder="e.g. Silk Oversized Shirt"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <GlassInput
                  label="Price"
                  placeholder="₹1,999 or $49"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="Category"
                placeholder="e.g. Apparel, Footwear, Consulting"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium">
                  Product Image (Optional)
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-400 cursor-pointer hover:border-cyan-400/40 transition-colors">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">Upload mockup or image pack</span>
                </div>
              </div>
            </div>

            <GlassTextarea
              label="Description & Key Benefits"
              required
              rows={2}
              placeholder="What makes this product special? Key materials, benefits, or use cases..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <GlassButton
                type="button"
                variant="cyanGlow"
                size="sm"
                onClick={handleAddProduct}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Save to Catalog
              </GlassButton>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono">
            {error}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
