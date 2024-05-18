"use client";

import { processIntakeForm } from "@/app/actions";
import { Box, Button, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useTransition } from "react";
import steps from "./steps";

export default function IntakeForm({ id }: { id: string }) {
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState(steps[step].questions);
  const [question, setQuestion] = useState(0);
  const [formData, setFormData] = useState<any>([]);
  const [finished, setFinished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState(false);

  const renderQuestion = () => {
    return (
      <>
        <Box display="flex" justifyContent="space-between" gap={5} mb={2}>
          <Typography>Q. {steps[step].questions[question].q}</Typography>
          <Typography>
            {question + 1}/{questions.length}
          </Typography>
        </Box>
        <TextField
          multiline
          rows={8}
          fullWidth
          placeholder={steps[step].questions[question].p}
          value={formData[step]?.[question] || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={error}
          helperText={error ? "Please provide an answer." : ""}
        />
      </>
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setError(!value);

    setFormData((prevFormData: any) => {
      const updatedFormData = [...prevFormData];

      if (!updatedFormData[step]) {
        updatedFormData[step] = [];
      }

      updatedFormData[step][question] = value;

      return updatedFormData;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") handleNext();
  };

  const handleNext = () => {
    if (!formData[step]?.[question]) {
      setError(true);
      return;
    }

    if (question < questions.length - 1) {
      setQuestion(question + 1);
    } else if (step < steps.length - 1) {
      setStep(step + 1);
      const nextQuestions = steps[step].questions;
      setQuestions(nextQuestions);
      setQuestion(0);
    } else if (step === steps.length - 1 && question === questions.length - 1) {
      setFinished(true);
      startTransition(async () => {
        await processIntakeForm("Discovery Framework", id, formData);
      });
    }
  };

  const handlePrev = () => {
    if (question > 0) {
      setQuestion(question - 1);
    } else if (step > 0) {
      setStep(step - 1);
      const prevQuestions = steps[step].questions;
      setQuestions(prevQuestions);
      setQuestion(prevQuestions.length - 1);
    }
  };

  return (
    <Paper elevation={4}>
      <Box p={5}>
        <Box mt={1} mb={8}>
          <Stepper activeStep={!finished ? step : step + 1} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {!finished && (
          <>
            {renderQuestion()}

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button onClick={handlePrev} disabled={step === 0 && question === 0}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </Box>
          </>
        )}

        {finished && (
          <Box display="flex" flexDirection="column" alignItems="center" py={5} gap={3}>
            <CircularProgress />
            <Box textAlign="center">
              <Typography>Thank you for your submission!</Typography>
              <Typography>Your information is currently being processed.</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
