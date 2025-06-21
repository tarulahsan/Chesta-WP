<?php
/**
 * Breadcrumbs function for MillionDollarTheme.
 *
 * @package MillionDollarTheme
 */

if ( ! function_exists( 'milliondollartheme_breadcrumbs' ) ) :
    /**
     * Display breadcrumbs for the current page.
     *
     * @param array $args Optional. Arguments to customize breadcrumbs.
     */
    function milliondollartheme_breadcrumbs( $args = array() ) {
        if ( is_front_page() ) {
            return; // No breadcrumbs on the front page.
        }

        $defaults = array(
            'separator'         => '&raquo;', // HTML entity for »
            'home_text'         => esc_html__( 'Home', 'milliondollartheme' ),
            'show_current'      => true,
            'show_on_home'      => false, // Deprecated, handled by is_front_page check
            'container_before'  => '<nav class="breadcrumbs-nav" aria-label="' . esc_attr__( 'Breadcrumb', 'milliondollartheme' ) . '">',
            'container_after'   => '</nav>',
            'list_before'       => '<ol class="breadcrumbs-list" itemscope itemtype="https://schema.org/BreadcrumbList">',
            'list_after'        => '</ol>',
            'item_before'       => '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">',
            'item_after'        => '</li>',
        );

        $args = wp_parse_args( $args, $defaults );

        $crumbs = array();
        $position = 1;

        // Home link
        $crumbs[] = sprintf(
            '%1$s<a itemprop="item" href="%2$s"><span itemprop="name">%3$s</span></a><meta itemprop="position" content="%4$d" />%5$s',
            $args['item_before'],
            esc_url( home_url( '/' ) ),
            $args['home_text'],
            $position++,
            $args['item_after']
        );

        // --- Main conditional logic ---

        if ( is_category() || is_tag() || is_tax() ) {
            $term = get_queried_object();
            if ( $term ) {
                $term_id = $term->term_id;
                $taxonomy = $term->taxonomy;
                $ancestors = get_ancestors( $term_id, $taxonomy );
                $ancestors = array_reverse( $ancestors );

                foreach ( $ancestors as $ancestor_id ) {
                    $ancestor_term = get_term( $ancestor_id, $taxonomy );
                    if ( $ancestor_term && ! is_wp_error( $ancestor_term ) ) {
                        $crumbs[] = sprintf(
                            '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                            $args['item_before'],
                            $args['separator'],
                            esc_url( get_term_link( $ancestor_term ) ),
                            esc_html( $ancestor_term->name ),
                            $position++,
                            $args['item_after']
                        );
                    }
                }
                // Current term
                if ( $args['show_current'] ) {
                     $crumbs[] = sprintf(
                        '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                        $args['item_before'],
                        $args['separator'],
                        esc_html( $term->name ),
                        $position++,
                        $args['item_after']
                    );
                } else {
                     $crumbs[] = sprintf(
                        '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                        $args['item_before'],
                        $args['separator'],
                        esc_url( get_term_link( $term ) ),
                        esc_html( $term->name ),
                        $position++,
                        $args['item_after']
                    );
                }
            }
        } elseif ( is_singular( 'post' ) ) {
            $post_categories = get_the_category();
            if ( $post_categories ) {
                // Use the first category. For a more complex setup, consider a primary category function.
                $category = $post_categories[0];
                $ancestors = get_ancestors( $category->term_id, 'category' );
                $ancestors = array_reverse( $ancestors );
                foreach ( $ancestors as $ancestor_id ) {
                    $ancestor_term = get_category( $ancestor_id );
                     $crumbs[] = sprintf(
                        '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                        $args['item_before'],
                        $args['separator'],
                        esc_url( get_category_link( $ancestor_term->term_id ) ),
                        esc_html( $ancestor_term->name ),
                        $position++,
                        $args['item_after']
                    );
                }
                // Current category
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                    $args['item_before'],
                    $args['separator'],
                    esc_url( get_category_link( $category->term_id ) ),
                    esc_html( $category->name ),
                    $position++,
                    $args['item_after']
                );
            }
            if ( $args['show_current'] ) {
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                    $args['item_before'],
                    $args['separator'],
                    get_the_title(),
                    $position++,
                    $args['item_after']
                );
            }
        } elseif ( is_page() ) {
            $post_obj = get_queried_object(); // Renamed to avoid conflict with global $post
            if ( $post_obj && property_exists($post_obj, 'post_parent') && $post_obj->post_parent ) { // Check if $post_obj is valid and has post_parent
                $ancestors = get_post_ancestors( $post_obj->ID );
                $ancestors = array_reverse( $ancestors );
                foreach ( $ancestors as $ancestor_id ) {
                     $crumbs[] = sprintf(
                        '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                        $args['item_before'],
                        $args['separator'],
                        esc_url( get_permalink( $ancestor_id ) ),
                        esc_html( get_the_title( $ancestor_id ) ),
                        $position++,
                        $args['item_after']
                    );
                }
            }
            if ( $args['show_current'] ) {
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                    $args['item_before'],
                    $args['separator'],
                    get_the_title(),
                    $position++,
                    $args['item_after']
                );
            }
        } elseif ( is_search() ) {
             $crumbs[] = sprintf(
                '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s "%4$s"</span><meta itemprop="position" content="%5$d" />%6$s',
                $args['item_before'],
                $args['separator'],
                esc_html__( 'Search results for', 'milliondollartheme' ),
                esc_html( get_search_query() ),
                $position++,
                $args['item_after']
            );
        } elseif ( is_404() ) {
             $crumbs[] = sprintf(
                '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                $args['item_before'],
                $args['separator'],
                esc_html__( 'Error 404', 'milliondollartheme' ),
                $position++,
                $args['item_after']
            );
        } elseif ( is_author() ) {
            $author = get_queried_object();
             $crumbs[] = sprintf(
                '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s %4$s</span><meta itemprop="position" content="%5$d" />%6$s',
                $args['item_before'],
                $args['separator'],
                esc_html__( 'Author Archives:', 'milliondollartheme' ),
                esc_html( $author->display_name ),
                $position++,
                $args['item_after']
            );
        } elseif ( is_date() ) {
            if ( is_year() ) {
                $year_text = get_the_date( _x( 'Y', 'yearly archives date format', 'milliondollartheme' ) );
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                    $args['item_before'], $args['separator'], $year_text, $position++, $args['item_after']
                );
            } elseif ( is_month() ) {
                $year_link = get_year_link( get_the_time( 'Y' ) );
                $year_text = get_the_date( _x( 'Y', 'yearly archives date format', 'milliondollartheme' ) );
                $month_text = get_the_date( _x( 'F', 'monthly archives date format', 'milliondollartheme' ) );
                 $crumbs[] = sprintf( '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s', $args['item_before'], $args['separator'], esc_url( $year_link ), $year_text, $position++, $args['item_after'] );
                 $crumbs[] = sprintf( '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s', $args['item_before'], $args['separator'], $month_text, $position++, $args['item_after'] );
            } elseif ( is_day() ) {
                $year_link = get_year_link( get_the_time( 'Y' ) );
                $year_text = get_the_date( _x( 'Y', 'yearly archives date format', 'milliondollartheme' ) );
                $month_link = get_month_link( get_the_time( 'Y' ), get_the_time( 'm' ) );
                $month_text = get_the_date( _x( 'F', 'monthly archives date format', 'milliondollartheme' ) );
                $day_text = get_the_date( _x( 'j', 'daily archives date format', 'milliondollartheme' ) );
                 $crumbs[] = sprintf( '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s', $args['item_before'], $args['separator'], esc_url( $year_link ), $year_text, $position++, $args['item_after'] );
                 $crumbs[] = sprintf( '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s', $args['item_before'], $args['separator'], esc_url( $month_link ), $month_text, $position++, $args['item_after'] );
                 $crumbs[] = sprintf( '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s', $args['item_before'], $args['separator'], $day_text, $position++, $args['item_after'] );
            }
        } elseif ( is_post_type_archive() ) {
            $post_type_obj = get_post_type_object( get_post_type() );
            if ( $post_type_obj ) {
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                    $args['item_before'],
                    $args['separator'],
                    esc_html( $post_type_obj->labels->archives ),
                    $position++,
                    $args['item_after']
                );
            }
        } elseif ( is_singular() ) { // For other CPTs (basic handling)
            $post_type_obj = get_post_type_object( get_post_type() );
            if ( $post_type_obj && $post_type_obj->has_archive ) {
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <a itemprop="item" href="%3$s"><span itemprop="name">%4$s</span></a><meta itemprop="position" content="%5$d" />%6$s',
                    $args['item_before'],
                    $args['separator'],
                    esc_url( get_post_type_archive_link( get_post_type() ) ),
                    esc_html( $post_type_obj->labels->archives ), // Or name
                    $position++,
                    $args['item_after']
                );
            }
            if ( $args['show_current'] ) {
                 $crumbs[] = sprintf(
                    '%1$s <span class="breadcrumb-separator">%2$s</span> <span itemprop="name">%3$s</span><meta itemprop="position" content="%4$d" />%5$s',
                    $args['item_before'],
                    $args['separator'],
                    get_the_title(),
                    $position++,
                    $args['item_after']
                );
            }
        }
        // TODO: Add more conditions like is_shop(), is_product_category() for WooCommerce if needed.

        // Output the breadcrumbs
        echo $args['container_before'] . $args['list_before'] . implode('', $crumbs) . $args['list_after'] . $args['container_after'];
    }
endif;
