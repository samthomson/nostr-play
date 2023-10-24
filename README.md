# nostr-contacts

A simple app to learn a bit more about nostr. The goal is to

- 'login'
- retrieve and display my contact list
Maybe even:
- add a note/description to each contact (eg where I know them from)
- send them a message

## setup

It's just a simple react app:

`yarn`
`yarn run start`

## todo

- get metadata for users (like name, profile pic etc, and generate a link to a stream of their posts - in a client)
- allow setting a 'local' nickname to each person
- get message contacts too, as they might not be the same as who I follow. dedup or display separately.
- deploy