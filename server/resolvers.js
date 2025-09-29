const { forms, responses, counters } = require("./data");

const root = {
  forms: () => forms,

  form: ({ id }) => forms.find((f) => f.id === id),

  responses: ({ formId }) => responses.filter((r) => r.formId === formId),

  createForm: ({ title, description, questions, showScore }) => {
    const form = {
      id: String(counters.formCounter++),
      title,
      description,
      showScore: showScore ?? true,
      questions: (questions || []).map((q) => ({
        id: String(counters.questionCounter++),
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    };
    forms.push(form);
    return form;
  },

  submitResponse: ({ formId, answers }) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) throw new Error("Form not found");

    let score = 0;
    let maxScore = 0;

    form.questions.forEach((q) => {
      const points = q.points || 0;
      maxScore += points;

      const userAnswer = answers.find((a) => a.questionId === q.id);
      if (!userAnswer) return;

      if (q.correctAnswer) {
        if (q.type === "CHECKBOX") {
          const correct = q.correctAnswer.split(",").map((s) => s.trim());
          const given = userAnswer.value.split(",").map((s) => s.trim());
          const isCorrect =
            correct.length === given.length &&
            correct.every((v) => given.includes(v));
          if (isCorrect) score += points;
        } else {
          if (userAnswer.value.trim() === q.correctAnswer.trim()) {
            score += points;
          }
        }
      }
    });

    const responseId = responses.filter((r) => r.formId === formId).length + 1;

    const response = {
      id: String(responseId),
      formId,
      answers,
      score,
      maxScore,
    };
    responses.push(response);
    return response;
  },

  deleteForm: ({ id }) => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return false;
    forms.splice(index, 1);
    return true;
  },

  updateForm: ({ id, title, description, questions, showScore }) => {
    const form = forms.find((f) => f.id === id);
    if (!form) return null;

    if (title !== undefined) form.title = title;
    if (description !== undefined) form.description = description;
    if (showScore !== undefined) form.showScore = showScore;

    if (questions !== undefined) {
      form.questions = (questions || []).map((q, i) => ({
        id: form.questions[i]?.id || String(counters.questionCounter++),
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      }));
    }

    return form;
  },
};

module.exports = root;
