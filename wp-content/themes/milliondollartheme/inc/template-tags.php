<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package MillionDollarTheme
 */

if ( ! function_exists( 'milliondollartheme_posted_on' ) ) :
    /**
     * Prints HTML with meta information for the current post-date/time.
     */
    function milliondollartheme_posted_on() {
        $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
        if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
            $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
        }

        $time_string = sprintf( $time_string,
            esc_attr( get_the_date( DATE_W3C ) ),
            esc_html( get_the_date() ),
            esc_attr( get_the_modified_date( DATE_W3C ) ),
            esc_html( get_the_modified_date() )
        );

        $posted_on = sprintf(
            /* translators: %s: post date. */
            esc_html_x( 'Posted on %s', 'post date', 'milliondollartheme' ),
            '<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
        );

        echo '<span class="posted-on">' . $posted_on . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

    }
endif;

if ( ! function_exists( 'milliondollartheme_posted_by' ) ) :
    /**
     * Prints HTML with meta information for the current author.
     */
    function milliondollartheme_posted_by() {
        $byline = sprintf(
            /* translators: %s: post author. */
            esc_html_x( 'by %s', 'post author', 'milliondollartheme' ),
            '<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
        );

        echo '<span class="byline"> ' . $byline . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

    }
endif;
// Add more template tags here

if ( ! function_exists( 'milliondollartheme_post_thumbnail' ) ) :
    /**
     * Displays an optional post thumbnail.
     *
     * Wraps the post thumbnail in an anchor element on index views, or a div
     * element on single views.
     */
    function milliondollartheme_post_thumbnail() {
        if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
            return;
        }

        if ( is_singular() ) :
            ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail( 'large' ); // Or 'full' or custom size ?>
            </div><!-- .post-thumbnail -->
            <?php
        else :
            ?>
            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                <?php
                the_post_thumbnail( 'post-thumbnail', array( // 'post-thumbnail' is default WordPress size
                    'alt' => the_title_attribute( array(
                        'echo' => false,
                    ) ),
                ) );
                ?>
            </a>
            <?php
        endif; // End is_singular().
    }
endif;

if ( ! function_exists( 'milliondollartheme_entry_footer' ) ) :
    /**
     * Prints HTML with meta information for the categories, tags and comments.
     */
    function milliondollartheme_entry_footer() {
        // Hide category and tag text for pages.
        if ( 'post' === get_post_type() ) {
            /* translators: used between list items, there is a space after the comma */
            $categories_list = get_the_category_list( esc_html__( ', ', 'milliondollartheme' ) );
            if ( $categories_list ) {
                /* translators: 1: list of categories. */
                printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'milliondollartheme' ) . '</span>', $categories_list ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }

            /* translators: used between list items, there is a space after the comma */
            $tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'milliondollartheme' ) );
            if ( $tags_list ) {
                /* translators: 1: list of tags. */
                printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'milliondollartheme' ) . '</span>', $tags_list ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }
        }

        if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
            echo '<span class="comments-link">';
            comments_popup_link(
                sprintf(
                    wp_kses(
                        /* translators: %s: post title */
                        __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'milliondollartheme' ),
                        array(
                            'span' => array(
                                'class' => array(),
                            ),
                        )
                    ),
                    get_the_title()
                )
            );
            echo '</span>';
        }

        edit_post_link(
            sprintf(
                wp_kses(
                    /* translators: %s: Name of current post. Only visible to screen readers */
                    __( 'Edit <span class="screen-reader-text">%s</span>', 'milliondollartheme' ),
                    array(
                        'span' => array(
                            'class' => array(),
                        ),
                    )
                ),
                get_the_title()
            ),
            '<span class="edit-link">',
            '</span>'
        );
    }
endif;

if ( ! function_exists( 'milliondollartheme_social_share_buttons' ) ) :
    /**
     * Displays social share buttons for the current post.
     */
    function milliondollartheme_social_share_buttons() {
        if ( ! get_theme_mod( 'milliondollartheme_show_social_share_buttons', true ) || ! is_singular('post') ) {
            return;
        }

        $post_url = urlencode( get_permalink() );
        $post_title = urlencode( html_entity_decode( get_the_title(), ENT_QUOTES, 'UTF-8' ) );
        $post_thumbnail_url = get_the_post_thumbnail_url( null, 'medium_large' ); // For Pinterest
        $post_thumbnail = $post_thumbnail_url ? urlencode($post_thumbnail_url) : '';


        $social_sites = array(
            'twitter' => array(
                'label' => __('Share on Twitter', 'milliondollartheme'),
                'url' => 'https://twitter.com/intent/tweet?text=' . $post_title . '&url=' . $post_url,
                'icon_slug' => 'twitter'
            ),
            'facebook' => array(
                'label' => __('Share on Facebook', 'milliondollartheme'),
                'url' => 'https://www.facebook.com/sharer/sharer.php?u=' . $post_url,
                'icon_slug' => 'facebook-alt' // Dashicon for Facebook is 'facebook-alt' or 'facebook'
            ),
            'linkedin' => array(
                'label' => __('Share on LinkedIn', 'milliondollartheme'),
                'url' => 'https://www.linkedin.com/shareArticle?mini=true&url=' . $post_url . '&title=' . $post_title,
                'icon_slug' => 'linkedin'
            ),
            'pinterest' => array(
                'label' => __('Pin it on Pinterest', 'milliondollartheme'),
                'url' => 'https://pinterest.com/pin/create/button/?url=' . $post_url . '&media=' . $post_thumbnail . '&description=' . $post_title,
                'icon_slug' => 'pinterest'
            ),
            'email' => array(
                'label' => __('Share via Email', 'milliondollartheme'),
                'url' => 'mailto:?subject=' . $post_title . '&body=' . sprintf(esc_html__('Check out this article: %s', 'milliondollartheme'), urldecode($post_url)), // urldecode for email body
                'icon_slug' => 'email-alt2'
            ),
            // 'whatsapp' => array(
            // 'label' => __('Share on WhatsApp', 'milliondollartheme'),
            // 'url' => 'https://api.whatsapp.com/send?text=' . $post_title . '%20' . $post_url,
            // 'icon_slug' => 'whatsapp' // Requires custom icon or Font Awesome
            // ),
        );

        echo '<div class="social-share-buttons">';
        echo '<h4 class="social-share-title">' . esc_html__( 'Share This Post:', 'milliondollartheme' ) . '</h4>';
        echo '<div class="share-links-wrapper">';
        foreach ( $social_sites as $slug => $site ) {
            printf(
                '<a href="%1$s" class="social-share-link social-share-%2\$s" target="_blank" rel="noopener noreferrer" aria-label="%3\$s">',
                esc_url( $site['url'] ),
                esc_attr( $slug ),
                esc_attr( $site['label'] )
            );

            $icon_class = 'dashicons-' . esc_attr($site['icon_slug']);
            echo '<span class="dashicons ' . $icon_class . '" title="' . esc_attr( $site['label'] ) . '"></span>';
            // echo '<span class="share-label">' . esc_html( ucfirst(\$slug) ) . '</span>'; // Optional text label
            echo '</a>';
        }
        echo '</div>'; // .share-links-wrapper
        echo '</div>'; // .social-share-buttons
    }
endif;
