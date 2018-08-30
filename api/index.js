import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';


let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
	assert.equal(null, err);

	mdb = db;
});

const router = express.Router();


router.get('/contests', (req, res) => {
	let contests = {};
	mdb.collection('contests').find({})
		.project({
			id:1,
			categoryName: 1,
			contestName: 1,
		})
		.each((err, contest) => {
			assert.equal(null, err);

			if (!contest) {//no more contests to process
				res.send({ contests });
				return;
			}
			contests[contest.id] = contest;
		});
});


router.get('/names/:nameIds', (req, res) => {
	//nameIds available as req.params.nameIds
	const nameIds = req.params.nameIds.split(',').map(Number);
	let names = {};
	mdb.collection('names').find({ id: { $in: nameIds }}) //find all names where the id is found within the array known as nameIds
		.each((err, name) => {
			assert.equal(null, err);

			if (!name) {//no more contests to process
				res.send({ names });
				return;
		}
		names[name.id] = name;
	});
}); 


router.get('/contests/:contestId', (req, res) => {
	//the id will thus be available as req.params.contestId
	mdb.collection('contests')
		.findOne({ id: Number(req.params.contestId) })
		.then(contest => res.send(contest))
		.catch(console.error);
}); 

export default router;