import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, type: 'income' | 'expense') => void;
  type: 'income' | 'expense';
}

const commonEmojis = [
  '💰', '💵', '💸', '💳', '🏦', '💼', '🏢', '📈', '💻', '🎓',
  '🍽️', '🍕', '☕', '🛒', '🚗', '⛽', '🏠', '🏥', '🎬', '✈️',
  '📱', '💊', '🎮', '📚', '🎵', '⚽', '👕', '👟', '💄', '🎁',
  '🔧', '🏋️', '🐕', '🌟', '💡', '📦', '🎨', '🍔', '🍰', '☂️',
];

const AddCategoryDialog = ({ isOpen, onClose, onAdd, type }: AddCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    if (!selectedIcon) {
      toast({
        title: "Missing Icon",
        description: "Please select an emoji icon",
        variant: "destructive",
      });
      return;
    }

    onAdd(name.trim(), selectedIcon, type);
    setName('');
    setSelectedIcon('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedIcon('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Icon</Label>
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`text-2xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
                      selectedIcon === emoji
                        ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                        : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {selectedIcon && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Selected:</span>
                  <span className="text-2xl">{selectedIcon}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className={type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
            >
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
