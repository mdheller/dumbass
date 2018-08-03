# breaking changes updated for 1.4

Probably there will be no breaking changes.

If I keep R the same as it is, but shift X to use cache (swapping X and R in this commit), then simply everything that needs cached / component updating shifts to X, but existing code is unchanged.

Additionally, I can keep render, for now, just as a wrapper over to.

## Update

Actually, there will be breaking changes. No more render, and things work a bit differently now. See the README.



