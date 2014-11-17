MouseEventSimulatorWithTouch
============================

Purpose of plug-in: To add touch event support to jQuery on existing mouse event based functionality
--------------------------------------------------------------------------

How to use/apply mouse event handler behavior to touch events? Its only one call like below, which will do the job to copy all mouse based functionality to touch.

//Element selector is either id or css-class, follow same rules for jquery selectors
$(selector).mouse2touch()

OR

jQueryElementObj.mouse2touch()