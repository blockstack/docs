---
title: A decentralized storage architecture
description: Storing user data with Blockstack
images:
  large: /images/pages/data-storage.svg
  sm: /images/pages/data-storage-sm.svg
---

## Introduction

The Blockstack Network stores application data using a storage system called
Gaia. Transactional metadata is stored on the Blockstack blockchain and user
application data is stored in Gaia storage. Storing data off of the blockchain
ensures that Stacks applications can provide users with high performance and
high availability for data reads and writes without introducing central trust
parties.

## Understand Gaia in the Blockstack architecture

The following diagram depicts the Blockstack architecture and Gaia's place in it:

![Blockstack Architecture](/images/architecture.png)

Blockchains require consensus among large numbers of people, so they can be slow. Additionally, a blockchain is not designed to hold a lot of data. This means using a blockchain for every bit of data a user might write and store is expensive. For example, imagine if an application were storing every tweet in the chain.

Blockstack addresses blockchain performance problems using a layered approach. The base layer consists of the Stacks blockchain and the Blockstack Naming System (BNS). The blockchain governs ownership of identities in the Blockstack network. Identities can be names such as domain names, usernames, or application names.

When an identity is created, its creation is recorded in the Stacks blockchain. Identities make up the primary data stored into the Stacks blockchain. These identities correspond to routing data in the OSI stack. The routing data is stored in the Atlas Peer Network, the second layer. Every core node that joins the Blockstack Network is able to obtain an entire copy of this routing data. Blockstack uses the routing data to associate identities (domain names, user names, and application names) with a particular storage location in the final layer, the Gaia Storage System.

A Gaia Storage System consists of a _hub service_ and storage resource on a cloud software provider. The storage provider can be any commercial provider such as Azure, DigitalOcean, Amazon EC2, and so forth. Typically the compute resource and the storage resource reside same cloud vendor, though this is not a requirement. Gaia currently has driver support for S3 and Azure Blob Storage, but the driver model allows for other backend support as well.

Gaia stores data as a simple key-value store. When an identity is created, a corresponding data store is associated with that identity on Gaia. When a user logs into a dApp,
the authentication process gives the application the URL of a Gaia hub, which
then writes to storage on behalf of that user.

Within Blockstack, then, the Stacks blockchain stores only identity data. Data created by the actions of an identity is stored in a Gaia Storage System. Each user has profile data. When a user interacts with a decentralized dApp that application stores application data on behalf of the user. Because Gaia stores user and application data off the blockchain, a Blockstack DApp is typically more performant than DApps created on other blockchains.

## User control or how is Gaia decentralized?

A Gaia hub runs as a service which writes to data storage. The storage itself is a simple key-value store. The hub service
writes to data storage by requiring a valid authentication token from a requestor. Typically, the hub service runs on a compute resource and the storage itself on separate, dedicated storage resource. Typically, both resources belong to the same cloud computing provider.

![Gaiastorage](/images/gaia-storage.png)

Gaia's approach to decentralization focuses on user control of data and its storage. Users can choose a Gaia hub provider. If a user can choose which Gaia hub provider to use, then that choice is all the decentralization required to enable user-controlled applications. Moreover, Gaia a uniform API to access for applications to access that data.

The control of user data lies in the way that user data is accessed. When an application fetches a file `data.txt` for a given user `alice.id`, the lookup will follow these steps:

1. Fetch the `zonefile` for `alice.id`.
2. Read her profile URL from her `zonefile`.
3. Fetch Alice's profile.
4. _Verify_ that the profile is signed by `alice.id`'s key
5. Read the `gaiaHubUrl` (e.g. `https://gaia.alice.org/`) out of the profile
6. Fetch the file from `https://gaia.alice.org/data.txt`.

Because `alice.id` has access to her zonefile, she can change where her profile is stored. For example, she may do this if the current profile's service provider or storage is compromised. To change where her profile is stored, she changes her Gaia hub URL to another Gaia hub URL. If a user has sufficient compute and storage resources, a user may run their own Gaia Storage System and bypass a commercial Gaia hub provider all together.

~> Users with existing identities cannot yet migrate their data from one hub to another.

Applications writing directly on behalf of `alice.id` do not need to perform a lookup. Instead, the [Stacks authentication flow](http://blockstack.github.io/stacks.js/index.html) provides Alice's chosen application root URL to the application. This authentication flow _is also_ within Alice's control because Alice's browser _must_ generate the authentication response.

## Understand data storage

A Gaia hub stores the written data _exactly_ as given. It offers minimal guarantees about the data. It does not ensure that data is validly formatted, contains valid signatures, or is encrypted. Rather, the design philosophy is that these concerns are client-side concerns.

Client libraries (such as `Stacks.js`) are capable of providing these guarantees. Blockstack used a liberal definition of the [end-to-end principle](https://en.wikipedia.org/wiki/End-to-end_principle) to guide this design decision.

## Gaia versus other storage systems

Here's how Gaia stacks up against other decentralized storage systems. Features
that are common to all storage systems are omitted for brevity.

| Features                                   | [Gaia](https://github.com/blockstack/gaia) | [Sia](https://sia.tech/) | [Storj](https://storj.io/) | [IPFS](https://ipfs.io/) | [DAT](https://datproject.org/) | [SSB](https://www.scuttlebutt.nz/) |
| ------------------------------------------ | ------------------------------------------ | ------------------------ | -------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| User controls where data is hosted         | X                                          |                          |                            |                          |                                |                                    |
| Data can be viewed in a normal Web browser | X                                          |                          |                            | X                        |                                |                                    |
| Data is read/write                         | X                                          |                          |                            |                          | X                              | X                                  |
| Data can be deleted                        | X                                          |                          |                            |                          | X                              | X                                  |
| Data can be listed                         | X                                          | X                        | X                          |                          | X                              | X                                  |
| Deleted data space is reclaimed            | X                                          | X                        | X                          | X                        |                                |                                    |
| Data lookups have predictable performance  | X                                          |                          | X                          |                          |                                |                                    |
| Writes permission can be delegated         | X                                          |                          |                            |                          |                                |                                    |
| Listing permission can be delegated        | X                                          |                          |                            |                          |                                |                                    |
| Supports multiple backends natively        | X                                          |                          | X                          |                          |                                |                                    |
| Data is globally addressable               | X                                          | X                        | X                          | X                        | X                              |                                    |
| Needs a cryptocurrency to work             |                                            | X                        | X                          |                          |                                |                                    |
| Data is content-addressed                  |                                            | X                        | X                          | X                        | X                              | X                                  |
