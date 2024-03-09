import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { TypographyP } from "@/components/ui/typography";
import { useAllPlayers } from "@/hooks/api/player/useAllPlayers";
import { useCreateMultiplePlayers } from "@/hooks/api/player/useCreateMultiplePlayers";
import { OverlayStateProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  names: z.array(z.string().min(1).max(20)).min(1).max(11),
});

function AddMultiplePlayersDialog({ open, setOpen }: OverlayStateProps) {
  const form = useForm<{ names: string[] }>({
    resolver: zodResolver(schema),
    defaultValues: {
      names: [" "],
    },
  });

  const { handleSubmit, control, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names" as never,
    shouldUnregister: false,
  });

  const { refetch } = useAllPlayers();
  const { createMultiplePlayers, isPending } = useCreateMultiplePlayers();

  function onSubmit(data: { names: string[] }) {
    createMultiplePlayers(data.names, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
    refetch();
  }

  function handleAdd(index: number) {
    if (11 - fields.length === 0) return;
    append("");
    setTimeout(() => {
      const lastInput = document.getElementById(`player-input-${index + 1}`);
      lastInput?.focus();
    }, 0);
  }

  function handleEnterKeyPress(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd(index);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Multiple Player</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-h-[calc(100dvh-120px)] min-h-96 space-y-3 overflow-y-auto p-4"
          >
            {fields.map((name, index) => (
              <div key={name.id} className="flex items-center gap-4">
                <FormField
                  name={`names.${index}`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          id={`player-input-${index}`}
                          placeholder="Player name"
                          className="w-full"
                          {...field}
                          onKeyDown={(e) => handleEnterKeyPress(e, index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    className="aspect-square p-0"
                    onClick={() => remove(index)}
                  >
                    <Minus size={20} />
                  </Button>
                )}
              </div>
            ))}

            <DrawerFooter className="!mt-8 w-full flex-row items-end !justify-between">
              <TypographyP className="text-sm text-muted-foreground">
                Max: 11 players, {11 - fields.length} left
              </TypographyP>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  disabled={11 - fields.length === 0}
                  onClick={() => handleAdd(fields.length)}
                >
                  <Plus /> Add Field
                </Button>
                <LoadingButton
                  size="sm"
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                >
                  {isPending ? "Adding..." : "Add"}
                </LoadingButton>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default AddMultiplePlayersDialog;