document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const quizContent = document.getElementById('quiz-content');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const nextBtn = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const retryBtn = document.getElementById('retry-btn');

    const quizData = [
        {
            question: "What is an essential first step in budgeting?",
            options: ["Tracking expenses", "Investing in stocks", "Buying insurance", "Opening a savings account"],
            answer: 0,
            feedback: "Tracking expenses helps you understand where your money goes and forms the basis for creating a budget.",
            detailedFeedback: "Tracking expenses is crucial because it allows you to identify where your money is going. This information helps in setting up a budget that aligns with your financial goals and avoids overspending."
        },
        {
            question: "What is the purpose of an emergency fund?",
            options: ["To cover regular monthly expenses", "To save for retirement", "To cover unexpected situations", "To invest in stocks"],
            answer: 2,
            feedback: "An emergency fund is meant to cover unexpected situations such as medical emergencies, job loss, or urgent repairs.",
            detailedFeedback: "Unexpected situations like scams or job loss can happen at any time. Having an emergency fund ensures that you are financially prepared to handle these challenges without disrupting your regular finances."
        },
        {
            question: "What is a common budgeting mistake?",
            options: ["Not tracking expenses", "Setting realistic goals", "Saving for retirement", "Creating a spending plan"],
            answer: 0,
            feedback: "Not tracking expenses can lead to overspending and a lack of understanding of where your money is going.",
            detailedFeedback: "Many people forget to track their expenses, which can result in not having a clear picture of their financial situation. This often leads to overspending and poor financial decisions."
        },
        {
            question: "How much do you usually spend on food daily? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "Understanding your daily food expenses helps you identify areas where you might save or adjust your spending to better manage your budget."
        },
        {
            question: "What is a good way to reduce debt?",
            options: ["Ignoring it", "Paying only the minimum payments", "Consolidating loans", "Increasing credit card usage"],
            answer: 2,
            feedback: "Consolidating loans can simplify payments and may reduce the overall interest rate, helping you manage and reduce debt more effectively.",
            detailedFeedback: "Debt consolidation can help you manage debt more effectively by combining multiple debts into a single payment with a potentially lower interest rate, making it easier to pay off your debt."
        },
        {
            question: "How do you prioritize your spending when creating a budget? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "Prioritizing spending is crucial in budgeting. Essential expenses such as housing, utilities, and groceries should be prioritized. Once necessities are covered, allocate funds towards savings and discretionary spending. This approach ensures that your basic needs are met before considering non-essential purchases."
        },
        {
            question: "What strategies do you use to track your expenses effectively? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "Effective expense tracking involves using tools like budgeting apps or spreadsheets. Regularly recording transactions and reviewing your spending patterns helps identify areas for improvement. Consistent tracking also ensures that you stay within your budget and adjust as needed."
        },
        {
            question: "How often do you review and adjust your budget? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "Regularly reviewing and adjusting your budget is important for maintaining financial health. Monthly reviews help you stay on track and address any overspending or changes in income. Adjust your budget as necessary to reflect new financial goals or unexpected expenses."
        },
        {
            question: "What methods do you use to save for short-term and long-term goals? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "For short-term goals, consider setting aside funds in a high-yield savings account. For long-term goals, such as retirement, invest in vehicles like mutual funds or retirement accounts. Using a combination of savings and investments helps you achieve both immediate and future financial objectives."
        },
        {
            question: "How do you handle financial setbacks or unexpected expenses? (Open-ended)",
            type: "open-ended",
            detailedFeedback: "Handling financial setbacks involves having an emergency fund to cover unexpected costs. Creating a plan to address the setback, such as adjusting your budget or seeking additional income sources, can also help. Planning ahead and having a financial cushion provides stability during challenging times."
        },
        {
            question: "What is the benefit of creating a monthly budget?",
            options: ["It helps in accumulating debt", "It provides insight into your spending habits", "It limits your spending to only essentials", "It automatically saves money for you"],
            answer: 1,
            detailedFeedback: "Creating a monthly budget helps you track and understand your spending habits, making it easier to identify areas where you can cut back and save more effectively."
        },
        {
            question: "What is the benefit of setting financial goals?",
            options: ["To spend more money", "To track your income", "To provide direction and motivation", "To avoid budgeting"],
            answer: 2,
            detailedFeedback: "Setting financial goals provides direction and motivation for your spending and saving habits. It helps you focus on achieving specific objectives and ensures you stay on track with your financial plans."
        },
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomQuestions(data, numQuestions, maxOpenEnded) {
        const openEndedQuestions = data.filter(q => q.type === 'open-ended');
        const multipleChoiceQuestions = data.filter(q => q.type !== 'open-ended');

        const selectedOpenEnded = shuffleArray(openEndedQuestions).slice(0, Math.min(maxOpenEnded, openEndedQuestions.length));
        const numMultipleChoice = Math.max(0, numQuestions - selectedOpenEnded.length);
        const selectedMultipleChoice = shuffleArray(multipleChoiceQuestions).slice(0, numMultipleChoice);
        const selectedQuestions = shuffleArray(selectedOpenEnded.concat(selectedMultipleChoice));
        
        return selectedQuestions.length < numQuestions
            ? selectedQuestions.concat(shuffleArray(multipleChoiceQuestions).slice(selectedQuestions.length, numQuestions))
            : selectedQuestions;
    }

    const quizQuestions = getRandomQuestions(quizData, 5, 2);

    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let currentQuestion = {};

    function startQuiz() {
        startBtn.classList.add('hidden');
        quizContent.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        showQuestion();
    }

    function showQuestion() {
        currentQuestion = quizQuestions[currentQuestionIndex];
        questionNumber.textContent = `Q${currentQuestionIndex + 1}`;
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        if (currentQuestion.options) {
            optionsContainer.innerHTML = currentQuestion.options.map((option, i) => `
                <div class="option">
                    <label>
                        <input type="radio" name="option" value="${i}">
                        ${option}
                    </label>
                </div>
            `).join('');
            nextBtn.textContent = 'Submit'; // Change button text to 'Submit'
        } else if (currentQuestion.type === 'open-ended') {
            optionsContainer.innerHTML = `
                <textarea id="open-ended-answer" rows="4" placeholder="Your answer here..."></textarea>
            `;
            nextBtn.textContent = 'Submit'; // Change button text to 'Submit'
        }
        feedbackContainer.innerHTML = '';
    }

    function handleNext() {
        const question = currentQuestion;
        let selectedAnswer;

        if (question.options) {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            if (selectedOption) {
                selectedAnswer = parseInt(selectedOption.value);
                userAnswers.push({ question: question.question, answer: selectedAnswer });
                if (selectedAnswer === question.answer) {
                    score++;
                    feedbackContainer.innerHTML = `<p class="feedback correct">Correct! ${question.detailedFeedback}</p>`;
                } else {
                    feedbackContainer.innerHTML = `<p class="feedback incorrect">Incorrect. ${question.detailedFeedback}</p>`;
                }
            } else {
                alert('Please select an option.');
                return;
            }
        } else if (question.type === 'open-ended') {
            selectedAnswer = document.getElementById('open-ended-answer').value;
            userAnswers.push({ question: question.question, answer: selectedAnswer });
            if (selectedAnswer.trim()) { // Award point for any non-empty answer
                score++;
                feedbackContainer.innerHTML = `<p class="feedback">Your answer: ${selectedAnswer}. ${question.detailedFeedback}</p>`;
            } else {
                feedbackContainer.innerHTML = `<p class="feedback">Your answer: ${selectedAnswer}. ${question.detailedFeedback}</p>`;
            }
        }
        currentQuestionIndex++;
        
        // Update the button text back to 'Next' for the next question
        nextBtn.textContent = 'Next';
        
        if (currentQuestionIndex < quizQuestions.length) {
            setTimeout(showQuestion, 3000); // Delay showing the next question to let user read feedback
            showQuestion();
        } else {
            setTimeout(showResult, 2000); // Delay showing the result
        }
        
    }

    function showResult() {
        quizContent.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        resultText.innerHTML = `
            <p>You answered ${score} out of ${quizQuestions.length} questions correctly.</p>
            <p>${getFeedback()}</p>
        `;
    }

    function getFeedback() {
        if (score === quizQuestions.length) {
            return "Excellent work! You have a strong understanding of financial management.";
        } else if (score >= quizQuestions.length / 2) {
            return "Good job! You have a solid grasp of financial concepts, but there's room for improvement.";
        } else {
            return "Keep practicing! Review the feedback for each question to improve your financial knowledge.";
        }
    }

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', handleNext);
    retryBtn.addEventListener('click', () => location.reload());
});
