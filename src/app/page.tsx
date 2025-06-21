"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword ] = useState("");

  const { data: session } = authClient.useSession();

  const handleSignUp = async () => {
    await authClient.signUp.email({
      name,
      email,
      password,
    }, {
      onSuccess: () => {
        window.alert("Sign up successful");
      },
      onError: (error) => {
        window.alert(`Sign up failed: ${error.error.message}`);
      }
    });
  };

  const handleSignIn = async () => {

    await authClient.signIn.email({
      email,
      password,
    });
  };

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Welcome {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleSignUp}>Sign up</Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleSignIn}>Sign in</Button>
      </div>
    </div>
  );
}
