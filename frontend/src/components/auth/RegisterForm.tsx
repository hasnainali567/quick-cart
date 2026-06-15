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
import { LoaderCircle, Mail, Password, User } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { signUp } from "@/lib/auth";
import { toast } from "sonner";

function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<{
    name: string;
    email: string;
    password: string;
  }>();

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
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Form Data:", data);
    try {
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onError: ({ error }) => {
            toast.error(
              error.message || "Failed to create account. Please try again.",
            );
          },
          onSuccess: () => {
            navigate("/");
          },
        },
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.",
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
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter the information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={User} />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="name"
                    type="text"
                    required
                    placeholder="e.g John Doe"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be 3 character long",
                      },
                    })}
                  />
                </InputGroup>
                {errors.name && (
                  <FieldDescription className="text-red-500">
                    {errors.name.message as string}
                  </FieldDescription>
                )}
              </Field>
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
                <div>
                  {passwordSuggestions.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-400">
                      {passwordSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Field>
              <Field>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <HugeiconsIcon
                      icon={LoaderCircle}
                      className="animate-spin"
                    />
                  ) : (
                    "Register"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm;
