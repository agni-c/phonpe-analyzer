"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category, SubCategory } from '@/types/finance'
import { useTransactions } from '@/contexts/TransactionContext'

interface CategoryFormProps {
  onSubmit: (category: Partial<Category>) => void
  initialData?: Category
}

function CategoryForm({ onSubmit, initialData }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>(initialData || {
    name: '',
    budget: 0,
    subCategories: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', budget: 0, subCategories: [] })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Food & Dining"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monthly Budget</label>
        <Input
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          placeholder="0.00"
          required
        />
      </div>
      <Button type="submit">
        {initialData ? 'Update Category' : 'Add Category'}
      </Button>
    </form>
  )
}

interface SubCategoryFormProps {
  onSubmit: (subCategory: Partial<SubCategory>) => void
  parentCategoryId: string
  initialData?: SubCategory
}

function SubCategoryForm({ onSubmit, parentCategoryId, initialData }: SubCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<SubCategory>>(initialData || {
    name: '',
    budget: 0,
    parentCategoryId
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', budget: 0, parentCategoryId })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Subcategory Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Groceries"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monthly Budget</label>
        <Input
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          placeholder="0.00"
          required
        />
      </div>
      <Button type="submit" variant="outline">
        {initialData ? 'Update Subcategory' : 'Add Subcategory'}
      </Button>
    </form>
  )
}

export function CategoryManager() {
  const { state, dispatch } = useTransactions()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleAddCategory = (category: Partial<Category>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      subCategories: [],
    } as Category

    dispatch({ type: 'ADD_CATEGORY', payload: newCategory })
  }

  const handleAddSubCategory = (categoryId: string, subCategory: Partial<SubCategory>) => {
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: crypto.randomUUID(),
      parentCategoryId: categoryId,
    } as SubCategory

    const category = state.categories.find(c => c.id === categoryId)
    if (category) {
      const updatedCategory: Category = {
        ...category,
        subCategories: [...category.subCategories, newSubCategory]
      }
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory })
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: categoryId })
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleAddCategory} />
          
          <div className="mt-6 space-y-4">
            {state.categories.map(category => (
              <Card key={category.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      Budget: ₹{category.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCategory(category)}
                    >
                      Manage
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Subcategories for {selectedCategory.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <SubCategoryForm
              parentCategoryId={selectedCategory.id}
              onSubmit={(subCategory) => handleAddSubCategory(selectedCategory.id, subCategory)}
            />

            <div className="mt-6 space-y-4">
              {selectedCategory.subCategories.map(subCategory => (
                <Card key={subCategory.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{subCategory.name}</h3>
                      <p className="text-sm text-gray-500">
                        Budget: ₹{subCategory.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
