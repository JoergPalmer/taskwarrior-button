/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Created by Nicolas Arnaud-Cormos <nicolas.arnaudcormos@gmail.com>
 * Based on the work from Izidor Matušov <izidor.matusov@gmail.com> (GTG Task Button)
 */

(function(window) {
    // Get preferences for this addon
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch("extensions.taskwarrior.");

    /*
     * Add our button to toolbar during the first load
     * The button will be on the right of archive
     */
    function initButton() {
        if (prefs.getBoolPref("firstRun")) {
            var button = 'taskwarrior-button';
            var after = 'hdrArchiveButton';
            var toolbar = 'header-view-toolbar';
            var currentset = document.getElementById(toolbar).currentSet;

            pos = currentset.indexOf(after);
            if (after !== "" && pos >= 0) {
                pos += after.length;
                currentset = currentset.substr(0, pos) + "," + button + currentset.substr(pos, currentset.length);
            }
            else {
                currentset = currentset + "," + button;
            }

            document.getElementById(toolbar).setAttribute("currentset", currentset);
            document.getElementById(toolbar).currentSet = currentset;
            document.persist(toolbar, "currentset");
            prefs.setBoolPref("firstRun", false);
        }
    }

    // add the button only when thunderbird is fully loaded
    addEventListener('load', initButton, false);

})(window);


