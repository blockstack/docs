---
layout: storage
permalink: /:collection/:path.html
---
# A decentralized storage architecture

The Blockstack Network stores application data using a storage system called
Gaia. Transactional metadata is stored on the Blockstack blockchain and user
application data is stored in Gaia storage. Storing data off of the blockchain
ensures that Blockstack applications can provide users with high performance and
high availability for data reads and writes without introducing central trust
parties.

* TOC
{:toc}

##  Understand Gaia in the Blockstack architecture

The following diagram depicts the Blockstack architecture and Gaia's place in it:

{% include architecture.md %}

## User control or how is Gaia decentralized?

A Gaia hub runs as a service which writes to data storage. The hub service
writes to data storage by requiring a valid authentication token from a requestor. Typically, the hub service runs on a compute resource and the storage itself on separate, dedicated storage resource. Typically, both resources belong to the same cloud vendor.

![Gaiastorage](/storage/images/gaia-storage.png)

Gaia's approach to decentralization focuses on user control of data and its
storage. If a user can choose which Gaia hub provider to use, then that choice
is all the decentralization required to enable user-controlled applications.

The control of user data lies in the way that user data is accessed.
When an application fetches a file `data.txt` for a given user `alice.id`, the
lookup will follow these steps:

1. Fetch the `zonefile` for `alice.id`.
2. Read her profile URL from her `zonefile`.
3. Fetch Alice's profile.
4.  _Verify_ that the profile is signed by `alice.id`'s key
5. Read the `gaiaHubUrl`  (e.g. `https://gaia.alice.org/`) out of the profile
6. Fetch the file from `https://gaia.alice.org/data.txt`.

Because `alice.id` has access to her zonefile, she can change where her profile
is stored. For example, she may do this if the current profile's service or
storage is compromised. To change where her profile is stored, she changes her
Gaia hub URL to another Gaia hub URL from another hub provider. If Alice has
sufficient compute and storage resources herself, she may run her own Gaia
Storage System and bypass a commercial Gaia hub provider all together.

{% include note.html content="Users with existing identities cannot yet migrate
their data from one hub to another." %}

Applications writing directly on behalf of Alice do not need to perform a
lookup. Instead, the Blockstack <a
href="http://blockstack.github.io/blockstack.js/index.html"
target="\_blank">authentication flow</a>  provides Alice's chosen application
root URL to the application. This authentication flow _is also_ within Alice's
control because Alice's browser _must_ generate the authentication response.


## Understand data storage

A Gaia hub stores the written data _exactly_ as given. It offers minimal
guarantees about the data. It does not ensure that data is validly formatted,
contains valid signatures, or is encrypted. Rather, the design philosophy is
that these concerns are client-side concerns.

Client libraries (such as `blockstack.js`) are capable of providing these
guarantees. Blockstack used a liberal definition of the <a href="https://en.wikipedia.org/wiki/End-to-end_principle" target="\_blank">end-to-end principle</a> to
guide this design decision.


## Gaia versus other storage systems

Here's how Gaia stacks up against other decentralized storage systems.  Features
that are common to all storage systems are omitted for brevity.

<table class="uk-table uk-table-striped">
<thead>
  <tr>
    <th>Features</th>
    <th>Gaia</th>
    <th><a href="https://sia.tech/" target="\_blank">Sia</a></th>
    <th><a href="https://storj.io/" target="\_blank">Storj</a></th>
    <th><a href="https://ipfs.io/" target="\_blank">IPFS</a></th>
    <th><a href="https://datproject.org/" target="\_blank">DAT</a></th>
    <th><a href="https://www.scuttlebutt.nz/" target="\_blank">SSB</a></th>
  </tr>
  </thead>
  <tr>
    <td>User controls where data is hosted</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Data can be viewed in a normal Web browser</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Data is read/write</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td>Data can be deleted</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td>Data can be listed</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td></td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td>Deleted data space is reclaimed</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Data lookups have predictable performance</td>
    <td>X</td>
    <td></td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Writes permission can be delegated</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Listing permission can be delegated</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Supports multiple backends natively</td>
    <td>X</td>
    <td></td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Data is globally addressable</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td></td>
  </tr>
  <tr>
    <td>Needs a cryptocurrency to work</td>
    <td></td>
    <td>X</td>
    <td>X</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Data is content-addressed</td>
    <td></td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
  </tr>
</table>
