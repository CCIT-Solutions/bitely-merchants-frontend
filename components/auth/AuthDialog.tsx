"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../custom/dialog";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
// import { useRouter } from "next/navigation";
import LoginForm from "@/modules/auth/LoginForm";
import RegisterForm from "@/modules/auth/RegisterForm";

export default function AuthDialog({
  triggerText = "Get a Ticket",
  triggerClassName,
  // redirectTo,
}: {
  triggerText?: string;
  triggerClassName?: string;
  // redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  // const router = useRouter();

  // function onSuccess() {
  //   setOpen(false);
  //   if (redirectTo) {
  //     router.push(redirectTo);
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setMode("login");
            setOpen(true);
          }}
          className={cn(
            triggerClassName
              ? triggerClassName
              : "bg-neutral-200 hover:bg-white hover:text-black text-black transition-all py-6 rounded-2xl min-w-48 cursor-pointer font-semibold tracking-widest w-full sm:w-auto"
          )}
        >
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black/80">
        <DialogHeader>
          <DialogTitle className="hidden">
            {mode === "login" ? "Login" : "Register"}
          </DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm
            // onSuccess={onSuccess}
            // onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            // onSuccess={onSuccess}
            // onSwitchToLogin={() => setMode("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
