/*=============================================================
    Authour URI: www.binarytheme.com
    License: Commons Attribution 3.0

    http://creativecommons.org/licenses/by/3.0/

    100% To use For Personal And Commercial Use.
    IN EXCHANGE JUST GIVE US CREDITS AND TELL YOUR FRIENDS ABOUT US
   
    ========================================================  */


(function($) {
    "use strict";
    var mainApp = {

        metisMenu: function() {

            /*====================================
            METIS MENU 
            ======================================*/

            $('#main-menu').metisMenu();

        },


        loadMenu: function() {

            /*====================================
            LOAD APPROPRIATE MENU BAR
         ======================================*/

            $(window).bind("load resize", function() {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });
        },
        slide_show: function() {

            /*====================================
           SLIDESHOW SCRIPTS
        ======================================*/

            $('#carousel-example').carousel({
                interval: 3000 // THIS TIME IS IN MILLI SECONDS
            })
        },
        reviews_fun: function() {
            /*====================================
         REWIEW SLIDE SCRIPTS
      ======================================*/
            $('#reviews').carousel({
                interval: 2000 //TIME IN MILLI SECONDS
            })
        },
        wizard_fun: function() {
            /*====================================
            //horizontal wizrd code section
             ======================================*/
            $(function() {
                $("#wizard").steps({
                    headerTag: "h2",
                    bodyTag: "section",
                    transitionEffect: "slideLeft"
                });
            });
            /*====================================
            //vertical wizrd  code section
            ======================================*/
            $(function() {
                $("#wizardV").steps({
                    headerTag: "h2",
                    bodyTag: "section",
                    transitionEffect: "slideLeft",
                    stepsOrientation: "vertical"
                });
            });
        },


    };
    $(document).ready(function() {
        mainApp.metisMenu();
        mainApp.loadMenu();
        mainApp.slide_show();
        mainApp.reviews_fun();
        mainApp.wizard_fun();
        initDropdowns();

    });
    function initDropdowns()
{
    if($('.dropdowns li').length)
    {
        var dropdowns = $('.dropdowns li');

        dropdowns.each(function()
        {
            var dropdown = $(this);
            if(dropdown.hasClass('has_children'))
            {
                if(dropdown.hasClass('active'))
                {
                    var panel = $(dropdown.find('> ul'));
                    var panelH = panel.prop('scrollHeight') + "px";

                    if(panel.css('max-height') == "0px")
                    {
                        panel.css('max-height', panel.prop('scrollHeight') + "px");
                    }
                    else
                    {
                        panel.css('max-height', "0px");
                    }
                }

                dropdown.find(' > .dropdown_item').on('click', function()
                {
                    var panel = $(dropdown.find('> ul'));
                    var panelH = panel.prop('scrollHeight') + "px";
                    dropdown.toggleClass('active');

                    if(panel.css('max-height') == "0px")
                    {
                        panel.css('max-height', panel.prop('scrollHeight') + "px");
                    }
                    else
                    {
                        panel.css('max-height', "0px");
                    }
                });
            }
        });
    }
}

}(jQuery));

//  Init Dropdowns



