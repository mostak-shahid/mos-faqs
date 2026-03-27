import { createRoot } from '@wordpress/element';
import ProductFAQPanel from './ProductFAQPanel';

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('mos-faq-woocommerce-container');
	if (container) {
		const root = createRoot(container);
		root.render(<ProductFAQPanel />);
	}
});
