"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session }=authClient.useSession()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email(
      {
        email,
        name,
        password,
      },
      {
        onError: () => {
          window.alert("Something went wrong");
        },
        onSuccess: () => {
          window.alert("Success!");
        },
      }
    );
  }
const onLogin = () => {
  authClient.signIn.email(
    {
      email,
      password,
    },
    {
      onError: () => {
        window.alert("Login failed");
      },
      onSuccess: () => {
        window.alert("Logged in successfully!");
      },
    }
  );
};

  if (session){
    return(
      <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as { session.user.name}</p>
      <Button onClick={()=>authClient.signOut()}>SignOut</Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gay-y-10">
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onSubmit}>
        Create User
      </Button>
      </div>
       <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onLogin}>
       Log In 
      </Button>
      </div>
    </div>
  );
}
