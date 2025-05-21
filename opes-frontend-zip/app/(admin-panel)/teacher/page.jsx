"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


export default function TeacherAuth() {

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (event) => {    
    event.preventDefault()
    let formData = new FormData(event.target)    
    
    const payload = {
      email:formData.get("email-login"),
      password:formData.get("password-login")
    }

    try {
      let response = await fetch(`${BACKEND_URL}/api/teachers/login`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      Cookies.set("token",data.token);
      console.log("Login successful:", data);
      router.push("/teacher-admin-panel");
    } catch (error) {
      console.error("Error loggin in : ", error)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    let formData = new FormData(event.target)
    const payload = {
      fullName:formData.get("name-signup"),
      email:formData.get("email-signup"),
      password:formData.get("password-signup")
    }

    try {
      let response = await fetch(`${BACKEND_URL}/api/teachers/register`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${data.message}`);
      }
      console.log("Registration successful:", data);
      // router.push("/teacher");

      const loginPayload = {
        email:formData.get("email-signup"),
        password:formData.get("password-signup")
      }
      await handleLoginAfterRegistration(loginPayload)
    } catch (error) {
      console.error("Error loggin in : ", error.message)
    }
  }

  const handleLoginAfterRegistration = async (payload) => {
    try {
      let response = await fetch(`${BACKEND_URL}/api/teachers/login`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      Cookies.set("token",data.token);
      console.log("Login successful:", data);
      router.push("/teacher-admin-panel");
    } catch (error) {
      console.error("Error loggin in : ", error)
    }
  }

  return (
    <div className="pt-14 bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Teacher Portal</CardTitle>
          <CardDescription className="text-center">Login or create an account to manage your exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" name="email-login" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <div className="relative">
                      <Input
                        id="password-login"
                        name="password-login"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <Input id="name-signup" name="name-signup" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" name="email-signup" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Input
                        id="password-signup"
                        name="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}