(function () {
    var BASE_URL = '/music';

    angular.module('music', ['ngMaterial'])
        .service('SubService', function ($http, $q) {
            this.getArtists = function () {
                var storageArtists = localStorage.getItem('artists');
                if (storageArtists) {
                    return $q(function (resolve) {
                        resolve(JSON.parse(storageArtists));
                    });
                } else {
                    return $http.get(BASE_URL + '/tracks.php')
                        .then(function (response) {
                            var artists = _.groupBy(response.data, 'artist');
                            artists = _.map(artists, function (tracks, artist) {
                                return {
                                    artist: artist,
                                    expanded: false,
                                    tracks: tracks
                                };
                            });

                            artists = _.orderBy(artists, ['tracks.length', 'artist'], ['desc', 'asc']);

                            localStorage.setItem('artists', JSON.stringify(artists));
                            return artists;
                        });
                }
            };

            this.addSong = function (songId) {
                return $http.post(BASE_URL + '/select.php?songId=' + songId);
            };
        })
        .controller('ListController', function ($scope, SubService, $timeout, $q) {
            $scope.artists = [];

            $scope.filter = '';
            $scope.limit = true;
            $scope.maxResults = 25;

            $scope.expandAll = false;

            $scope.times = 1;

            SubService.getArtists()
                .then(function (artists) {
                    $scope.artists = artists;
                });

            $scope.toggleExpanded = function (index) {
                var artist = $scope.filteredArtists[index];
                artist.expanded = !artist.expanded;
            };

            $scope.filterChanged = function () {
                $timeout(function () {
                    var rows = _.sumBy($scope.filteredArtists, function (fArtist) {
                        return fArtist.tracks.length + 1;
                    });

                    $scope.expandAll = rows <= 50;
                });
            };

            var filterTracksIntern = function (track, filter) {
                return track.title.toLocaleLowerCase().indexOf(filter) !== -1;
            };

            var filterArtistIntern = function (artist, filter) {
                return artist.toLocaleLowerCase().indexOf(filter) !== -1;
            };

            $scope.addTrackToPlaylist = function (track) {
                var promises = [];
                for (var i = 0; i < $scope.times; i++) {
                    promises.push(SubService.addSong(track.songID));
                }

                $q.all(promises)
                    .then(function () {
                        console.log("All done");
                    });
            };

            $scope.filterArtist = function (artist) {
                if ($scope.filter === '') {
                    return true;
                }

                var f = $scope.filter.toLocaleLowerCase();
                if (filterArtistIntern(artist.artist, f)) {
                    return true;
                }


                return _.findIndex(artist.tracks, function (track) {
                        return filterTracksIntern(track, f);
                    }) !== -1;
            };


            $scope.filterTracks = function (track) {
                if ($scope.filter === '') {
                    return true;
                }

                var f = $scope.filter.toLocaleLowerCase();
                if (filterArtistIntern(track.artist, f)) {
                    return true;
                }

                return filterTracksIntern(track, f);
            };
        });
})();