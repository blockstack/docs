---
title: Feature comparison
description: This page describes some other naming systems in comparison to Stacks.
---

## Introduction

BNS is not the only naming system in wide-spread use, nor is it the only
decentralized naming system that implements human-readable, globally-unique, and
strongly-owned names. This page describes some other naming systems in
comparison to Stacks:

## Stacks BNS vs DNS

Stacks BNS and DNS both implement naming systems, but in fundamentally
different ways. Stacks BNS _can be used_ for resolving host names to IP
addresses, but this is not its default use-case. The [Blockchain Naming
Service](/core/naming/introduction) (BNS) instead behaves
more like a decentralized
[LDAP](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) system for
resolving user names to user data.

While DNS and BNS handle different problems, they share some terminology and
serialization formats. However, it is important to recognize that this is the
_only_ thing they have in common---BNS has fundamentally different semantics
than DNS:

- **Zone files**: Stacks' BNS stores a DNS zone file for each name. However,
  the semantics of a BNS zone file are nothing like the semantics of a DNS zone
  file---the only thing they have in common is their format.
  A "standard" Stacks zone files only have `URI` and `TXT` resource records
  that point to the user's application data. Moreover, a Stacks ID has a
  _history_ of zone files, and historic zone files can alter the way in which a
  Stacks ID gets resolved (DNS has no such concept). It is conceivable that an advanced
  user could add `A` and `AAAA` records to their Stacks ID's zone file,
  but these are not honored by any Stacks software at this time.

- **Subdomains**: Stacks BNS has the concept of a subdomain, but it is
  semantically very different from a DNS subdomain. A Stacks BNS subdomain
  is a Stacks ID whose state and transaction history are anchored to the
  blockchain, but stored within an on-chain Stacks ID's zone file history.
  Unlike DNS subdomains, a BNS subdomain has
  its own owner and is a first-class BNS name---all subdomains are resolvable,
  and only the subdomain's owner can update the subdomain's records. The only thing BNS subdomains and DNS
  subdomains have in common is the name format (e.g. `foo.bar.baz` is a subdomain
  of `bar.baz` in both DNS and BNS).

More details can be found in the [Stacks BNS vs
DNS](/core/naming/comparison) document. A feature
comparison can be found at the end of the [Blockchain Naming
Service](/core/naming/introduction) document.

## Stacks BNS vs Namecoin

Namecoin also implements a decentralized naming service on top of a blockchain,
just like BNS. In fact, early versions of BNS were built on Namecoin.
However, [it was discovered](https://www.usenix.org/node/196209) that Namecoin's
merged mining with Bitcoin regularly placed it under the _de facto_ control of a single
miner. This prompted a re-architecting of the system to be _portable_ across
blockchains, so that if the underlying blockchain (currently Bitcoin)
ever became insecure, the system could migrate to a more secure blockchain.

A feature comparison can be found at the end of the [Blockchain Naming
Service](/core/naming/introduction) document.

## Stacks BNS vs ENS

ENS also implements a decentralized naming system on top of a blockchain, but as
a smart contract on Ethereum. Like BNS, ENS is geared towards resolving names
to off-chain state (ENS names resolve to a hash, for example). Moreover, ENS is
geared towards providing programmatic control over names with Turing-complete
on-chain resolvers.

BNS has a fundamentally different relationship with blockchains than ENS.
Whereas ENS tries to use on-chain logic as much as possible, BNS
tries to use the blockchain as little as possible. BNS only uses it to store a
database log for name operations (which are interpreted with an off-chain BNS
node like Stacks Blockchain). BNS name state and BNS subdomains reside entirely
off-chain in the Atlas network. This has allowed BNS to migrate from blockchain
to blockchain in order to survive individual blockchain failures, and this has
allowed BNS developers to upgrade its consensus rules without having to get the
blockchain's permission (see the [virtualchain
paper](https://blockstack.org/virtualchain.pdf) for details).

## Summary feature comparison

The following feature table provides a quick summary how BNS differs from other naming systems

| Feature                                        | BNS                                                                                    | [ENS](https://ens.domains/) | DNS     | [Namecoin](https://namecoin.org/) |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------- | ------- | --------------------------------- |
| Globally unique names                          | X                                                                                      | X                           | X       | X                                 |
| Human-readable names                           | X                                                                                      | X                           | X       | X                                 |
| Strongly-owned names                           | X                                                                                      | X                           |         | X                                 |
| Names are enumerable                           | X                                                                                      |                             |         | X                                 |
| Registration times                             | 1-2 hours                                                                              | ~1 week                     | ~1 day  | 1-2 hours                         |
| Subdomain registration times                   | 1 hour (instant with [#750](https://github.com/blockstack/blockstack-core/issues/750)) | varies                      | instant | ~1 hour                           |
| Anyone can make a TLD/namespace                | X                                                                                      | [1]                         |         | [1]                               |
| TLD/Namespace owners get registration fees     | X                                                                                      |                             | X       |                                   |
| TLD/Namespace can be seeded with initial names | X                                                                                      |                             | X       |                                   |
| Portable across blockchains                    | X                                                                                      |                             | N/A     |                                   |
| Off-chain names                                | X                                                                                      |                             | N/A     |                                   |
| Off-chain name state                           | X                                                                                      | X                           | N/A     |                                   |
| Name provenance                                | X                                                                                      | X                           |         | X                                 |
| [DID](http://identity.foundation) support      | X                                                                                      |                             |         |                                   |
| Turing-complete namespace rules                |                                                                                        | X                           | X       |                                   |
| Miners are rewarded for participating          | [1]                                                                                    |                             | N/A     | X                                 |

[1] Requires support in higher-level applications. These systems are not aware
of the existence of namespaces/TLDs at the protocol level.

[2] Stacks Blockchain destroys the underlying blockchain token to pay for
registration fees when there is no pay-to-namespace-creator address set in the
name's namespace. This has the effect of making the blockchain miners' holdings
slightly more valuable.
