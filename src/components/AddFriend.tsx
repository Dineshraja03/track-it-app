import { useState } from 'react';
import { ArrowLeft, UserPlus, Image as ImageIcon } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AddFriendProps {
  onBack: () => void;
}

const AddFriend = ({ onBack }: AddFriendProps) => {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addFriend } = useFriends();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfilePicture(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a friend name',
        variant: 'destructive',
      });
      return;
    }

    addFriend(name.trim(), profilePicture || undefined);
    toast({
      title: 'Success',
      description: `${name} added to your friends`,
    });
    onBack();
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Add Friend</h1>
        </div>
        <p className="text-white/90 text-sm">Add a new friend to track expenses</p>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Friend's Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter friend's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="picture">Profile Picture (Optional)</Label>
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG or GIF (Max 5MB)
                    </p>
                  </div>
                </label>
              </div>

              {imagePreview && (
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePicture(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full rounded-full" size="lg">
              <UserPlus size={20} className="mr-2" />
              Add Friend
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddFriend;
