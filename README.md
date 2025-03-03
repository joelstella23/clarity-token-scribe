# TokenScribe
A decentralized platform for e-book publishing on the Stacks blockchain.

## Features
- Publish e-books as NFTs with metadata
- Set pricing and royalties for books
- Purchase books using STX tokens
- Author verification and rights management 
- Revenue distribution to authors

## Setup and Installation
1. Clone the repository
2. Install Clarinet
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to execute test suite

## Usage Examples
```clarity
;; Publish a new book
(contract-call? .token-scribe publish-book "Book Title" "Author Name" "Description" u1000 u10)

;; Purchase a book
(contract-call? .token-scribe purchase-book u1)

;; Get book details
(contract-call? .token-scribe get-book-details u1)
```

## Dependencies
- Clarity language
- Clarinet for testing/deployment
- SIP-009 NFT standard
