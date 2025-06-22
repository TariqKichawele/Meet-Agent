import { auth } from '@/lib/auth';
import SignUpView from '@/modules/auth/ui/sign-up-view'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const SignUp = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }
  return (
    <SignUpView />
  )
}

export default SignUp