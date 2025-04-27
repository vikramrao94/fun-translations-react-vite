import { useState, useEffect } from "react";
import { Form, useNavigation } from "react-router";
import Button from "view/components/Button";
import Input from "view/components/Input";
import Select from "view/components/Select";

export function TranslateForm() {
  const navigation = useNavigation();
  const isSubmitting:boolean = navigation.state === "submitting";
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (navigation.state === "idle") {
      setText("");
    }
  }, [navigation.state]);

  return (
    <Form className="contents" method="POST" action="/translate">
      <fieldset className="flex flex-col items-start gap-6">
        {/* implement translation engine here */}
        <Input
          value={text}
          onChange={(e) => setText((e.target as HTMLInputElement).value)}
          placeholder="Enter the text to translate here" />
        <Select/>
        <Button type="submit">
          {isSubmitting ? "Translating..." : "Translate"}
        </Button>
      </fieldset>
    </Form>
  );
}
