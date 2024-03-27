const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

function fillData(randomCrossWord) {

    let crossword = {
        across: {},
        down: {},
    };

    let gridnum = randomCrossWord.data.gridnums;
    const myMap = new Map(); // It has the row col number of a word of any serial number.

    for (let i = 0; i < 15; ++i) {
        for (let j = 0; j < 15; ++j) {
            if (gridnum[15 * i + j] != 0) {
                myMap.set(gridnum[15 * i + j], [i, j]);
            }
        }
    }

    for (let i = 0; i < randomCrossWord.data.answers.across.length; ++i) {

        const ind = myMap.get(Number(randomCrossWord.data.clues.across[i].split(".")[0]));
        if (ind != undefined) {
            const inputString = randomCrossWord.data.clues.across[i];
            const entry = {
                clue: inputString.substring(inputString.indexOf('.') + 1).trim(),
                answer: randomCrossWord.data.answers.across[i],
                row: ind[0],
                col: ind[1],
            }

            crossword.across[Number(randomCrossWord.data.clues.across[i].split(".")[0])] = entry;
        }
    }

    for (let i = 0; i < randomCrossWord.data.answers.down.length; ++i) {

        const ind = myMap.get(Number(randomCrossWord.data.clues.down[i].split(".")[0]));
        if (ind != undefined) {
            const inputString = randomCrossWord.data.clues.down[i];
            const entry = {
                clue: inputString.substring(inputString.indexOf('.') + 1).trim(),
                answer: randomCrossWord.data.answers.down[i],
                row: ind[0],
                col: ind[1],
            }

            crossword.down[Number(randomCrossWord.data.clues.down[i].split(".")[0])] = entry;
        }
    }
    return crossword;
}

const signUp = async (req,res) => {
    const { userid, password } = req.body;

    if(!userid || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Please Provide required information",
        });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const userData = {
        userid,
        password: hash_password,
    };

    const user = await User.findOne({ userid });

    if(user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Username already taken",
        });
    } else {
        User.create(userData).then((data,err) => {
            if(err) res.status(StatusCodes.BAD_REQUEST).json({err});
            else 
                res
                .status(StatusCodes.CREATED)
                .json({message: "User created Successfully"});
        });
    }
};

const signIn = async (req,res) => {
    try {
        if(!req.body.userid || !req.body.password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please enter username and password",
            });
        }

        const user = await User.findOne({userid: req.body.userid});

        if(user) {
            if(await user.authenticate(req.body.password)) {
                const token = jwt.sign(
                    {username: user.userid, role: user.role},
                    process.env.JWT_SECRET, {expiresIn: "30d"}
                );

                res.cookie('token',token,{ 
                    expires: new Date(Date.now() + 24*60*60*1000) , 
                    httpOnly: true, 
                    sameSite: 'strict'
                });

                res.status(StatusCodes.OK).json({ user: user.userid, message: "Sign in successful" });
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Password or username incorrect!",
                });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "User does not exist!",
            });
        }
    } catch (error) {
        console.log("some error occured while signing you in.")
        res.status(StatusCodes.BAD_REQUEST).json({error});
    }
};

const logOut = async (req,res) => {
    try {
        res.cookie('token',"rubbishcontent",{ 
            expires: new Date(1) , 
            httpOnly: true,
            sameSite: 'strict',
            overwrite: true
        });
        req.session = null;
        res.status(StatusCodes.OK).json({ user: 'xyz', message: "coookie deleted successfully!" });
    } catch (error) {
        console.log(error)
    }
}

const boardData = async (req,res) => {
        let year = Math.floor(Math.random() * (2017 - 1977 + 1)) + 1977;
        while(year === 2015 || year === 2016 || year === 1978) {
            year = Math.floor(Math.random() * (2017 - 1977 + 1)) + 1977;
        }
        const mon = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
        const day = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
        
        const rc = await axios.get(`https://raw.githubusercontent.com/doshea/nyt_crosswords/master/${year}/${mon.toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}.json`);
        let cw = {
            across: {},
            down: {},
        };
        if (rc != undefined) cw = fillData(rc);
        let temp = JSON.parse(JSON.stringify(cw));
        for(let key in temp.across) {
            let ans = temp.across[key].answer;
            let toReplace = " ".repeat(ans.length);
            temp.across[key].answer = toReplace;
        }
        for(let key in temp.down) {
            let ans = temp.down[key].answer;
            let toReplace = " ".repeat(ans.length);
            temp.down[key].answer = toReplace;
        }
        res.status(StatusCodes.OK).json({cw, temp});
}

module.exports = { signUp, signIn, logOut, boardData };