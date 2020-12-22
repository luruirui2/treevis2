#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export

# 安装htmlwidgets包

treevis2 <- function(data, width = NULL, height = NULL, elementId = NULL) {
  
  
  # forward options using x
  x = list(
    data = data
  )
  
  # create widget
  htmlwidgets::createWidget(
    name = 'treevis2',
    x,
    width = width,
    height = height,
    package = 'treevis2',
    elementId = elementId
  )
}

#' Shiny bindings for treevis
#'
#' Output and render functions for using treevis within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a treevis
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name treevis-shiny
#'
#' @export
treevisOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'treevis2', width, height, package = 'treevis2')
}

#' @rdname treevis-shiny
#' @export
renderTreevis <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, treevisOutput, env, quoted = TRUE)
}
