'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateWatchlistEntry } from '../actions/watchlist.actions';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ratingFormSchema = z.object({
  status: z.enum(['want_to_watch', 'watching', 'watched']),
  rating: z.number().min(1).max(5).nullable(),
  note: z.string().max(500).nullable(),
});
type RatingFormValues = z.infer<typeof ratingFormSchema>;

const STATUS_LABELS: Record<RatingFormValues['status'], string> = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  watched: 'Watched',
};

interface RatingFormProps {
  entryId: string;
  initialValues: RatingFormValues;
  title: string;
  children: React.ReactNode; // Dialog trigger
}

export function RatingForm({
  entryId,
  initialValues,
  title,
  children,
}: RatingFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: RatingFormValues) => {
    startTransition(async () => {
      await updateWatchlistEntry(entryId, values);
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) reset(initialValues);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Rating</span>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <StarRating value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note" className="text-sm font-medium">Note</label>
            <Controller
              control={control}
              name="note"
              render={({ field }) => (
                <Textarea
                  id="note"
                  placeholder="Add a note..."
                  maxLength={500}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value || null)
                  }
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
