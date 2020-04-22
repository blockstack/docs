---
layout: learn
permalink: /:collection/:path.html
---
# Guide to Blockstack Profiles

{:.no_toc}



You can use the blockstack.js library to create and register an ID on the Stacks blockchain. This section describes the `Profile` object and contains the following topics:

* TOC
{:toc}

## About profiles

Profile data is stored using Gaia on the user's selected storage provider. An example of a `profile.json` file URL using Blockstack provided storage:

```
https://gaia.blockstack.org/hub/1EeZtGNdFrVB2AgLFsZbyBCF7UTZcEWhHk/profile.json
```

Follow these steps to create and register a profile for a Blockstack ID:

1. Create a JSON profile object
2. Split up the profile into tokens, sign the tokens, and put them in a token file
3. Create a zone file that points to the web location of the profile token file

```js
"account": [
	{
	  "@type": "Account",
	  "service": "twitter",
	  "identifier": "naval",
	  "proofType": "http",
	  "proofUrl": "https://twitter.com/naval/status/12345678901234567890"
	}
]
```

## Create a profile

```es6
const profileOfNaval = {
  "@context": "http://schema.org/",
  "@type": "Person",
  "name": "Naval Ravikant",
  "description": "Co-founder of AngelList"
}
```

## Sign a profile as a single token

```es6
import { makeECPrivateKey, wrapProfileToken, Person } from 'blockstack'

const privateKey = makeECPrivateKey()

const person = new Person(profileOfNaval)
const token = person.toToken(privateKey)
const tokenFile = [wrapProfileToken(token)]
```

## Verify an individual token

```js
import { verifyProfileToken } from 'blockstack'

try {
  const decodedToken = verifyProfileToken(tokenFile[0].token, publicKey)
} catch(e) {
  console.log(e)
}
```

## Recover a profile from a token file

```js
const recoveredProfile = Person.fromToken(tokenFile, publicKey)
```

## Validate profile schema

```js
const validationResults = Person.validateSchema(recoveredProfile)
```