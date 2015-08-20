/*
 * Stores the questions, answers and the answer history
 */

function QuestionBankModel(_simModel, _numerator, _denominator, _firstQuestion, _lastQuestion) {
	// save a link to the model
	this.simModel = _simModel;
	// the number of questions the student needs to answer right...
	this.numerator = _numerator;
	// out of this many of the most recent questions asked
	this.denominator = _denominator;
	// index of first question from question bank
	this.firstQuestion = _firstQuestion;
	// index of last question from question bank
	this.lastQuestion = _lastQuestion;
	// we need to keep track of the last <x> answers we've gotten
	// so we can test for mastery. we use an array as a queue that
	// stores as many answers as we're willing to consider
	this.resetAnswerHistory();
	// create the question list
	this.createNewQuestions();
}


QuestionBankModel.prototype.resetAnswerHistory = function() {
	// start with an empty array
	this.answerHistory = [];
	// push a bunch of null objects into the history to represent questions
	// that haven't been asked yet
	for (var i = 0; i < this.denominator; i++) {
		this.answerHistory.push(null);
	}
}


/*
 * Add a new item to the back of the answer history, pull an item off
 * the front. Since the queue starts out filled with nulls, it is always
 * the same size.
 */
QuestionBankModel.prototype.updateAnswerHistory = function(newAnswer) {
	// add a new item to the back of the answer history
	this.answerHistory.push(newAnswer);
	// pull the oldest item off the front
	this.answerHistory.shift();
}


/*
 * Look at the answer history to see if we have met the criterion for
 * demonstrating mastery
 */
QuestionBankModel.prototype.masteryAchieved = function() {
	// count up the number of right answers
	var count = 0;
	// loop through the answer history
	for (var i = 0; i < this.answerHistory.length; i++) {
		// if we got the question right
		if (this.answerHistory[i]) {
			// increase our count
			count += 1;
		}
	}
	// compare the correct count to our goal
	return count >= this.numerator;
}


/*
 * Compare the student's answer to the correct answer(s).
 */
QuestionBankModel.prototype.checkAnswer = function (studentAnswer) {
	for (var i = 0; i < this.answers.length; i++) {
		if (this.answers[i].toString().toLowerCase() == studentAnswer.toString().toLowerCase()) {
			return true;
		}
	}
	return false;
}


/*
 * Create a new set of question templateString
 */
QuestionBankModel.prototype.createNewQuestions = function() {
	// Each question template is an array holding either strings
  // or executable commands stored as strings.
  this.questions = [
 	 ["If we are using depth-first search, which node would be removed from the fringe next?"],
	 ["If we are using breadth-first search, which node would be removed from the fringe next?"],
	 ["If we are using uniform cost search, which node would be removed from the fringe next?"],
	 ["If we are using greedy search, which node would be removed from the fringe next?"],
	 ["If we are using A* search, which node would be removed from the fringe next?"],
  ];
  // the question index is used to rotate through the questions
  this.questionIndex = 0;
	// the answer(s) is/are stored in an array
	this.answers = [];
	// the actual question is stored in a string
	this.question = '';
}


/*
 * choose a random template and useit to construct a new question string
 */
QuestionBankModel.prototype.chooseQuestion = function() {
	// choose a question index at random
	this.questionIndex = getRandomInt(this.firstQuestion, this.lastQuestion + 1);
	// get the corresponding question template
	var questionTemplate = this.questions[this.questionIndex];
	// start with an empty question string
	this.question = "";
	// loop through every line of the template
	for (index = 0; index < questionTemplate.length; index++) {
		// get the next line of the template
		var templateString = questionTemplate[index];
		// add it to the question string
		this.question = this.question + templateString;
	}
	this.question += " Indicate your answer using the Row # of the correct node.";
	this.question += " In the event of a tie, choose any one of the tied nodes."
	return this.question;
}


/*
 * Set the answer(s) to the question indicated by questionIndex.
 * Right now I'm using a really clunky approach. I'm sure there's
 * a better way.
 */
QuestionBankModel.prototype.setAnswers = function(_fringe) {
	// Reset answers array
	this.answers = [];
	// depth-first search - last node added
	if (this.questionIndex == 0) {
		this.answers.push(_fringe.fringeNodes.length - 1);
	// breadth-first search - first node added
	} else if (this.questionIndex == 1) {
		this.answers.push(0);
	// uniform cost search - nodes with lowest cost
	} else if (this.questionIndex == 2) {
		this.answers = _fringe.lowestCost().slice();
	// greedy search - nodes with lowest heuristic value
	} else if (this.questionIndex == 3) {
		this.answers = _fringe.lowestHeuristic().slice();
	} else {
		this.answers = _fringe.lowestGScore().slice();
	}
}
