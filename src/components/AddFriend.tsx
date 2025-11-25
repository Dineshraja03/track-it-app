import { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
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
  const { addFriend } = useFriends();
  const { toast } = useToast();

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

    addFriend(name.trim());
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
