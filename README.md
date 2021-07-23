# Solid Friend Crawler

Live at [friends.livegraph.org](https://friends.livegraph.org)

Visualize the network of friends on Solid

The app starts at the logged user (and timbl on solidcommunity.net) and crawls the foaf:knows connections.

## TODO

- [x] add people to history of browser (will allow browsing)
- [x] make people a variable size based on how many people know them
- [ ] show clearly what are the directions of :knows
- [x] show also who knows this person
- [x] login for different pod providers
- [x] faster (parallel) crawling
- [x] search people
  - [ ] make it more accessible and easier to navigate
- [x] highlight also people who know the person
- [ ] highlight people whose button is crawled in PersonList
- [ ] add custom starting point for crawling
- [x] support extended profile (seeAlso, sameAs)
- [x] figure hosting it as SPA with router
