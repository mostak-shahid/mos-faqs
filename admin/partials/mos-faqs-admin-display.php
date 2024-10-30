<?php
// If this file is called directly, abort.
if (!defined('ABSPATH')) die;
$mos_faqs_options = mos_faqs_get_option();

$actual_link = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://" . (isset($_SERVER['HTTP_HOST']) && isset($_SERVER['REQUEST_URI'])) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) . sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';

$dataOptions = [
    '1' => esc_html__('Option 1', 'mos-faqs'),
    '2' => esc_html__('Option 2', 'mos-faqs'),
    '3' => esc_html__('Option 3', 'mos-faqs'),
    '4' => esc_html__('Option 4', 'mos-faqs'),
]

?>
<div class="mos-faqs-settings-wrapper">
    <form method='post'>
        <?php wp_nonce_field('options_form_action', 'options_form_field'); ?>
        <div class="mos-faqs-settings-container">
            <div class="mos-faqs-settings">
                <div class="part-title">
                    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                </div>
                <div class="part-options">
                    <?php
                    if (isset($_POST['options_form_field']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['options_form_field'])), 'options_form_action')) {
                        if (isset($_POST['settings-updated'])) {
                            add_settings_error('mos-faqs-messages', 'mos-faqs-message', esc_html__('All changes have been applied correctly, ensuring your preferences are now in effect.', 'mos-faqs'), 'updated');
                        }
                        settings_errors('mos-faqs-messages');
                    }
                    ?>
                    <table class="form-table" role="presentation">
                        <tbody>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="text-input"><?php echo esc_html__('Text Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative input_text">
                                        <label for="text-input">
                                            <input type="text" name="mos_faqs_options[base-input][text-input]" id="text-input" value="<?php echo isset($mos_faqs_options['base-input']['text-input']) ? esc_html($mos_faqs_options['base-input']['text-input']) : '' ?>">
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="email-input"><?php echo esc_html__('Email Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative input_email">
                                        <label for="email-input">
                                            <input type="email" name="mos_faqs_options[base-input][email-input]" id="email-input" value="<?php echo isset($mos_faqs_options['base-input']['email-input']) ? esc_html($mos_faqs_options['base-input']['email-input']) : '' ?>">
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="color-input"><?php echo esc_html__('Color Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative input_color">
                                        <label for="color-input">
                                            <input type="color" name="mos_faqs_options[base-input][color-input]" id="color-input" value="<?php echo isset($mos_faqs_options['base-input']['color-input']) ? esc_html($mos_faqs_options['base-input']['color-input']) : '' ?>">
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="date-input"><?php echo esc_html__('Date Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative input_date">
                                        <label for="date-input">
                                            <input type="date" name="mos_faqs_options[base-input][date-input]" id="date-input" value="<?php echo isset($mos_faqs_options['base-input']['date-input']) ? esc_html($mos_faqs_options['base-input']['date-input']) : '' ?>">
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="datetime-local-input"><?php echo esc_html__('Datetime local Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative input_datetime_local">
                                        <label for="datetime-local-input">
                                            <input type="datetime-local" name="mos_faqs_options[base-input][datetime-local-input]" id="datetime-local-input" value="<?php echo isset($mos_faqs_options['base-input']['datetime-local-input']) ? esc_html($mos_faqs_options['base-input']['datetime-local-input']) : '' ?>">
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="textarea-input"><?php echo esc_html__('Textarea', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative textarea">
                                        <label for="textarea-input">
                                            <textarea type="text" name="mos_faqs_options[base-input][textarea-input]" id="textarea-input"><?php echo isset($mos_faqs_options['base-input']['textarea-input']) ? esc_html($mos_faqs_options['base-input']['textarea-input']) : '' ?></textarea>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="switch-input"><?php echo esc_html__('Enable Product Tabs', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative mos-faqs-switcher">
                                        <label for="mos_faqs_options_switch-input">
                                            <input type="checkbox" name="mos_faqs_options[base-input][switch-input]" id="mos_faqs_options_switch-input" value="1" <?php checked(@$mos_faqs_options['base-input']['switch-input'], 1, 1) ?>>
                                            <em data-on="on" data-off="off"></em>
                                            <span></span>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="radio-input"><?php echo esc_html__('Radio Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative radio">
                                        <div class="radio-wrapper">
                                            <?php if (isset($dataOptions) && sizeof($dataOptions)) : ?>
                                                <?php foreach ($dataOptions as $key => $value) : ?>
                                                    <div class="radio-unit">
                                                        <input class="radio-input radio-input-1" name="mos_faqs_options[base-input][radio-input]" id="radio-input-<?php echo esc_html(sanitize_title($key)) ?>" type="radio" value="<?php echo esc_html($key) ?>" <?php checked(@$mos_faqs_options['base-input']['radio-input'], $key, 1) ?>>
                                                        <label for="radio-input-<?php echo esc_html(sanitize_title($key)) ?>"><span></span> <?php echo esc_html($value) ?></label>
                                                    </div>
                                                <?php endforeach ?>
                                            <?php endif ?>

                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="datalist-input"><?php echo esc_html__('Datalist Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative datalist">
                                        <label for="datalist-input">
                                            <input list="mos_faqs_options_datalist-input" name="mos_faqs_options[base-input][datalist-input]" id="datalist-input" value="<?php echo isset($mos_faqs_options['base-input']['datalist-input']) ? esc_html($mos_faqs_options['base-input']['datalist-input']) : '' ?>">
                                        </label>
                                        <datalist id="mos_faqs_options_datalist-input">
                                            <?php if (isset($dataOptions) && sizeof($dataOptions)) : ?>
                                                <?php foreach ($dataOptions as $key => $value) : ?>
                                                    <option><?php echo esc_html($value) ?></option>
                                                <?php endforeach ?>
                                            <?php endif ?>
                                        </datalist>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="select-input"><?php echo esc_html__('Select Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative select">

                                        <label for="select-input">
                                            <select name="mos_faqs_options[base-input][select-input]" id="select-input">
                                                <option value=""><?php echo esc_html__('Select One', 'mos-faqs') ?></option>
                                                <?php if (isset($dataOptions) && sizeof($dataOptions)) : ?>
                                                    <?php foreach ($dataOptions as $key => $value) : ?>
                                                        <option value="<?php echo esc_html($key) ?>" <?php selected(@$mos_faqs_options['base-input']['select-input'], $key, 1) ?>><?php echo esc_html($value) ?></option>
                                                    <?php endforeach ?>
                                                <?php endif ?>
                                            </select>
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="checkbox-input"><?php echo esc_html__('Checkbox Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative select">
                                        <div class="checkbox-group" id="checkbox-input">
                                            <?php if (isset($dataOptions) && sizeof($dataOptions)) : ?>
                                                <?php foreach ($dataOptions as $key => $value) : ?>
                                                    <div class="checkbox-unit">
                                                        <label>
                                                            <input type="checkbox" value="<?php echo esc_html($key) ?>" name="mos_faqs_options[array-input][checkbox-input][]" <?php checked(in_array($key, @$mos_faqs_options['array-input']['checkbox-input']), 1, 1) ?>>
                                                            <span><?php echo esc_html($value) ?></span>
                                                        </label>
                                                    </div>
                                                <?php endforeach ?>
                                            <?php endif ?>

                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="multi-select-input"><?php echo esc_html__('Multi Select Input', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative select">
                                        <label for="multi-select-input">
                                            <select name="mos_faqs_options[array-input][multi-select-input][]" id="multi-select-input" multiple>
                                                <?php if (isset($dataOptions) && sizeof($dataOptions)) : ?>
                                                    <?php foreach ($dataOptions as $key => $value) : ?>
                                                        <option value="<?php echo esc_html($key) ?>" <?php selected(in_array($key, @$mos_faqs_options['array-input']['multi-select-input']), 1, 1) ?>><?php echo esc_html($value) ?></option>
                                                    <?php endforeach ?>
                                                <?php endif ?>
                                            </select>
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            <tr class="mos_faqs_row">
                                <th scope="row"><label for="editor-input"><?php echo esc_html__('Editor', 'mos-faqs') ?></label></th>
                                <td>
                                    <div class="position-relative textarea">
                                        <label for="editor-input">
                                            <?php
                                            $editor_id = esc_html(sanitize_title('editor-input'));
                                            $arg = array(
                                                'textarea_name' => esc_html('mos_faqs_options[editor-input]'),
                                            );
                                            wp_editor($mos_faqs_options['editor-input'], $editor_id, $arg);
                                            ?>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <?php //submit_button(); 
        ?>
        <p class="submit">
            <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php echo esc_html__('Save Changes', 'mos-faqs') ?>">
            <button class="button mos-faqs-button-reset button-secondary" data-name="all" data-url="<?php echo esc_url($actual_link) ?>"><?php echo esc_html__('Reset', 'mos-faqs') ?></button>
        </p>
    </form>
</div>