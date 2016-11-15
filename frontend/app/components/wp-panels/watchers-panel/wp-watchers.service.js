// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

angular
  .module('openproject.services')
  .factory('wpWatchers', wpWatchers);

function wpWatchers($http, $q) {



  var remove = function(workPackage, watcher) {
    var removed = $q.defer(),
      path = workPackage.removeWatcher.$link.href,
      method = workPackage.removeWatcher.$link.method;

    path = path.replace(/\{user\_id\}/, watcher.id);

    $http[method](path).then(function() {
      removed.resolve(watcher);

    }, function(err) {
      remove.reject(err);
    });

    return removed.promise;
  };

  /*
   * NOTE: In theory, this service is independent from WorkPackages,
   * however, the only thing currently handled by it is WorkPackage
   * related watching.
   * This might change in the future, as other Objects are watchable in
   * OP - e.g. wiki pages.
   *
   * The public interface is therefore designed around handling WPs
   */
  return {
    removeFromWorkPackage: remove
  };
}
