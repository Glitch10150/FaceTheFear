import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle } from "lucide-react";

export default function ApplicationForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      username: "",
      discord: "",
      experience: "",
      role: "",
      availability: [],
      motivation: "",
      whyAcceptYou: "",
      previousGroups: "",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Submitted!",
        description: "Your application has been received and is now under review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertApplication) => {
    submitApplication.mutate(data);
  };

  if (showSuccess) {
    return (
      <Card className="faction-card p-8">
        <CardContent className="p-0 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-4">APPLICATION SUBMITTED!</h3>
          <p className="text-gray-300 mb-6">
            Your application has been received and is now under review. 
            You'll hear back from us within 48 hours.
          </p>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="gta-button px-6 py-3 font-[Orbitron]"
          >
            SUBMIT ANOTHER
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="faction-card p-8">
      <CardContent className="p-0">
        <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-6">APPLICATION FORM</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Gaming Username *</FormLabel>
                  <FormControl>
                    <Input 
                      className="form-input"
                      placeholder="Your in-game name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Discord Username *</FormLabel>
                  <FormControl>
                    <Input 
                      className="form-input"
                      placeholder="YourName#1234"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Gaming Experience *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (&lt; 1 year)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                      <SelectItem value="expert">Expert (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Preferred Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select your preferred role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assault">Assault/Frontline</SelectItem>
                      <SelectItem value="sniper">Sniper/Marksman</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="medic">Medic/Healer</SelectItem>
                      <SelectItem value="driver">Driver/Pilot</SelectItem>
                      <SelectItem value="strategist">Strategist/Leader</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Availability *</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {["weekdays", "weekends", "evenings", "nights"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={field.value?.includes(option)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, option]);
                            } else {
                              field.onChange(currentValue.filter((item) => item !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-gray-300 capitalize">
                          {option === "nights" ? "Late Nights" : option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Why do you want to join Face the Fear? *</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="form-input h-32"
                      placeholder="Tell us about your motivation, skills, and what you can bring to the faction..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyAcceptYou"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Why should we accept you in our team? *</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="form-input h-32"
                      placeholder="What unique skills, experience, or qualities do you bring to the team? Why are you the right fit for Face the Fear?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousGroups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Previous Gaming Groups</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="form-input h-24"
                      placeholder="List any previous clans, guilds, or gaming groups you've been part of..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="gta-button w-full py-4 font-[Orbitron] text-lg"
              disabled={submitApplication.isPending}
            >
              {submitApplication.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                "SUBMIT APPLICATION"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
