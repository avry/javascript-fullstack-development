import express from 'express';
import data from '../src/testData';

const router = express.Router();
const contests = data.contests.reduce((obj, contest) => {
	obj[contest.id] = contest;
	return obj;
}, {});

router.get('/contests', (req, res) => {
	res.send({
		contests: contests
	});
}); 

router.get('/contests/:contestId', (req, res) => {
	//the id will thus be available as req.params.contestId
	let contest = contests[req.params.contestId];
	contest.description = 'some placeholder description';

	res.send(contest);
}); 

export default router;