/*
Package sessions is a reusable web sessions library designed by
Dave Stearns at the University of Washington Information School,
to be implemented by his INFO 344 students.

This library provides digitally-signed random session IDs,
an abstract session state Store interface that can accept
any sort of sessoin state struct the application wishes to use,
and two concrete implementations of that interface: one backed by
an in-memory cache, and another backed by a redis database.

It also includes a few package-level functions for beginning
a new session, getting the SessionID and session state from
an *http.Request, and ending a session. These functions use
the Authorization HTTP header for transmitting the SessionID.
*/
package sessions
