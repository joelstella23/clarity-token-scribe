;; TokenScribe Contract
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-price (err u101))
(define-constant err-not-found (err u102))
(define-constant err-already-purchased (err u103))

;; NFT Definition
(define-non-fungible-token book uint)

;; Data Variables
(define-map books 
  uint 
  {
    title: (string-ascii 256),
    author: principal,
    description: (string-ascii 1024),
    price: uint,
    royalty: uint,
    published: uint
  }
)
(define-data-var last-book-id uint u0)

;; Book Publishing
(define-public (publish-book (title (string-ascii 256)) 
                           (description (string-ascii 1024))
                           (price uint)
                           (royalty uint))
  (let ((book-id (+ (var-get last-book-id) u1)))
    (try! (nft-mint? book book-id tx-sender))
    (map-set books book-id
      {
        title: title,
        author: tx-sender,
        description: description,
        price: price,
        royalty: royalty,
        published: block-height
      }
    )
    (var-set last-book-id book-id)
    (ok book-id)
  )
)

;; Book Purchase
(define-public (purchase-book (book-id uint))
  (let ((book-data (unwrap! (map-get? books book-id) err-not-found)))
    (try! (stx-transfer? (get price book-data) tx-sender (get author book-data)))
    (try! (nft-transfer? book book-id (get author book-data) tx-sender))
    (ok true)
  )
)

;; Read Only Functions
(define-read-only (get-book-details (book-id uint))
  (ok (map-get? books book-id))
)

(define-read-only (get-owner (book-id uint))
  (ok (nft-get-owner? book book-id))
)

(define-read-only (get-last-token-id)
  (ok (var-get last-book-id))
)
