/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import path from 'path'
import dns from 'dns'
import { addDoc, getDoc, deleteDoc, getDocs, doc, where, query, collection, getFirestore } from 'firebase/firestore'
import firebaseConfig from './firebaseconfig.js'
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const Urls = collection(db, 'Url')

// getting all the shorturls
export const getUrls = async (req:Request, res:Response) => {
	const urls = await getDocs(Urls)
	return res.json(urls.docs.map(e => e.data()))
}
// Adding the shorturl
export const addUrls = async (req:Request, res:Response) => {
	const shorturl :string = req.body.shorturl
	const url : string = req.body.url
	// To check whether the shorturl already exists or not
	const urls = await getDocs(Urls)
	const search = urls.docs.find(e => e.data().shorturl == req.body.shorturl)
	const search2 = urls.docs.find(e => e.data().url == req.body.url)

	if (search) return res.status(401).send('This shorturl already exists!')
	if (search2) return res.status(401).send('You have shortened this url before!')

	// To remove "https" and "www." from the url
	const ok = url.replace('https://', '')
	if (ok.includes('www.')) {
		const brok = ok.replace('www.', '')
		dns.lookup(brok, (err) => {
			if (err) {
				res.status(404).sendFile(path.join(__dirname, './url/error.html'))
			}
			else {
				addDoc(Urls, {
					shorturl:shorturl,
					url:url,
				}).then(() => res.status(200).send('Added that url!'))
			}
		})
	}
	else {
		dns.lookup(ok, (err) => {
			if (err) {
				res.status(404).sendFile(path.join(__dirname, './url/error.html'))
			}
			else {
				addDoc(Urls, {
					shorturl:shorturl,
					url: url,
				}).then((e) => res.status(200).send('Added that url!'))
			}
		})
	}
}

// Deleting the url
export const deleteUrl = async (req:Request, res:Response) => {
	let id = ''
	if (!await getDocs(query(Urls, where('shorturl', '==', req.body.shorturl))).then(e => e.docs.find(x => x.data().shorturl == req.body.shorturl))) {
		return res.status(400).send('This shorturl doesn\'t exist')
	}
	else {
		await getDocs(query(Urls, where('shorturl', '==', req.body.shorturl))).then(e => {
			e.docs.map(x => id = x.id)
		})
		deleteDoc(doc(db, 'Url', id)).then(e => res.send('deleted that shorturl'))
	}
}
// Redirecting to the url
export const redirectUrl = async (req:Request, res:Response) => {
	const urls = await getDocs(Urls)
	const search = urls.docs.find(e => e.data().shorturl == req.params.shorturl)

	if (!search) return res.send('This shorturl doesn\'t exist')
	getDocs(query(Urls, where('shorturl', '==', req.params.shorturl))).then(e => {
		e.docs.map(x => {
			return res.redirect(x.data().url)
		})
	})
}
