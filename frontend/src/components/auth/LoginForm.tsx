import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Link, useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Mail, Password } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { signIn } from "@/lib/auth";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ email: string; password: string; remember: string }>();

  const password = watch("password", "");

  const passwordSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    if (password.length === 0) {
      return suggestions;
    }
    if (password.length < 8) {
      suggestions.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      suggestions.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      suggestions.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      suggestions.push("Password must contain at least one number");
    }
    return suggestions;
  }, [password]);

  const onSubmit = async (data: {
    email: string;
    password: string;
    remember: string;
  }) => {
    console.log("Form Data:", data);
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.remember === "on",
        },
        {
          onError: ({ error }) => {
            toast.error(
              error.message ||
                "Failed to login. Please check your credentials and try again.",
            );
          },
          onSuccess: ({ data }) => {
            const role = data?.user?.role;
            console.log(data, role);

            if (role === "SUPER_ADMIN") {
              navigate("/admin/dashboard");
              return;
            }
            if (role === "STORE_ADMIN") {
              navigate("/store/dashboard");
              return;
            }
            navigate("/");
          },
        },
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to login. Please check your credentials and try again.",
      );
    }
  };

  return (
    <div
      className={cn("w-full max-w-md flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Mail} />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    type="email"
                    required
                    placeholder="m@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </InputGroup>
                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message as string}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <p className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </p>
                </div>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Password} />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                      },
                    })}
                  />
                </InputGroup>
                <FieldDescription>
                  {passwordSuggestions.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-400">
                      {passwordSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </FieldDescription>
              </Field>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" {...register("remember")} />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Field>
                <Button type="submit">Login</Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">Register</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
