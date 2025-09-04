import { __ } from "@wordpress/i18n";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import * as ipaddr from "ipaddr.js";
import React, {
	useRef,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import "./TagInput.scss";

// Validation functions
function isValidIpOrCidr(value) {
	try {
		if (value.includes("/")) {
			// CIDR path
			const [addr, prefix] = ipaddr.parseCIDR(value); // throws if invalid
			const max = addr.kind() === "ipv4" ? 32 : 128;
			return Number.isInteger(prefix) && prefix >= 0 && prefix <= max;
		}
		// Single IP path
		ipaddr.parse(value); // throws if invalid
		return true;
	} catch {
		return false;
	}
}

function isValidEmail(value) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(value);
}

function isValidUrl(value) {
	try {
		// Try to create a URL object - this will throw for invalid URLs
		new URL(value.startsWith('http') ? value : `https://${value}`);
		return true;
	} catch {
		return false;
	}
}

const TagInput = forwardRef(
	(
		{ type = "tag", initialTags, whitelist = [], name, handleChange },
		ref,
	) => {
		const tagifyInputRef = useRef(null);
		const tagifyInstanceRef = useRef(null);
		const isInternalChangeRef = useRef(false);
		const lastInitialTagsRef = useRef(null);
		const isInitializedRef = useRef(false);
		const skipNextSyncRef = useRef(false);

		const formattedInitialTags = Array.isArray(initialTags)
			? initialTags.map((item) =>
					item.value && item.code
						? { value: item.value, code: item.code }
						: item,
			  )
			: [];

		const [currentTags, setCurrentTags] = useState(formattedInitialTags);

		useEffect(() => {
			if (isInitializedRef.current || !tagifyInputRef.current) return;

			const baseOptions = {
				whitelist: whitelist.map(item =>
					item.value && item.code ? { value: item.value, code: item.code } : item
				),
				dropdown: { maxItems: whitelist.length, enabled: 0 },
				originalInputValueFormat: (valuesArr) => JSON.stringify(valuesArr),
				pasteAsTags: true,
				duplicates: false,

				// Central validation based on type
				validate: (tagData) => {
					const value = tagData.value;
					
					switch (type) {
						case "ip":
							return isValidIpOrCidr(value) || "Invalid IP or CIDR";
						case "email":
							return isValidEmail(value) || "Invalid email address";
						case "url":
							return isValidUrl(value) || "Invalid URL";
						case "role":
						case "page":
						case "category":
						case "method":
						case "username":
						case "tag":
							// For types with whitelist, validate against whitelist
							if (whitelist.length > 0) {
								const isValid = whitelist.some(item => 
									(typeof item === 'object' ? item.value === value : item === value)
								);
								return isValid || "Invalid selection";
							}
							return true; // No validation if no whitelist
						default:
							return true; // No validation for unknown types
					}
				},
			};

			tagifyInstanceRef.current = new Tagify(tagifyInputRef.current, baseOptions);
			const instance = tagifyInstanceRef.current;

			const handleTagChange = (e) => {
				let parsed;
				try { parsed = JSON.parse(e.detail.value); } catch { parsed = []; }
				setCurrentTags(parsed);
				handleChange(name, parsed);
				isInternalChangeRef.current = false;
			};
			instance.on("change", handleTagChange);

			if (formattedInitialTags.length > 0) {
				isInternalChangeRef.current = true;
				instance.addTags(formattedInitialTags);
			}
			lastInitialTagsRef.current = JSON.stringify(formattedInitialTags);
			isInitializedRef.current = true;

			return () => {
				try { tagifyInstanceRef.current?.destroy?.(); } catch {}
				tagifyInstanceRef.current = null;
				isInitializedRef.current = false;
			};
		}, []);

		useEffect(() => {
			if (!tagifyInstanceRef.current || !isInitializedRef.current) {
				return;
			}

			const newInitialTagsJSON = JSON.stringify(formattedInitialTags);

			if (skipNextSyncRef.current) {
				skipNextSyncRef.current = false;
				lastInitialTagsRef.current = newInitialTagsJSON;
				return;
			}

			if (isInternalChangeRef.current) {
				return;
			}

			const currentValues = tagifyInstanceRef.current.value || [];
			const currentJSON = JSON.stringify(currentValues);

			isInternalChangeRef.current = true;

			setTimeout(() => {
				if (tagifyInstanceRef.current && isInitializedRef.current) {
					tagifyInstanceRef.current.removeAllTags();
					if (formattedInitialTags.length > 0) {
						tagifyInstanceRef.current.addTags(formattedInitialTags);
					}
					setTimeout(() => {
						isInternalChangeRef.current = false;
					}, 100);
				}
			}, 0);

			lastInitialTagsRef.current = newInitialTagsJSON;
		}, [initialTags]);

		const handleSelectAll = () => {
			tagifyInstanceRef.current.removeAllTags();
			const allTags = whitelist.map((item) =>
				typeof item === "object" && item.value ? item : { value: item },
			);
			tagifyInstanceRef.current.addTags(allTags);
		};

		const handleRemoveAll = () => {
			tagifyInstanceRef.current.removeAllTags();
		};

		useImperativeHandle(ref, () => ({
			addTag: (tag) => {
				if (tagifyInstanceRef.current) {
					tagifyInstanceRef.current.addTags([tag]);
				}
			},
		}));

		return (
			<div className="tagify-wrapper">
				<input
					type="text"
					ref={tagifyInputRef}
					placeholder={`Add ${type}...`}
				/>
				{whitelist.length > 0 && (
					<div className="tagify-button-group mt-2">
						<button
							type="button"
							className="tagify-button select-all-buton pl-heading-1 fw-600 text-purple-40"
							onClick={handleSelectAll}
						>
							{__("Select All", "mos-faqs")}
						</button>
						<button
							type="button"
							className="tagify-button remove-all-button pl-heading-1 fw-600 text-extra"
							onClick={handleRemoveAll}
						>
							{__("Remove All", "mos-faqs")}
						</button>
					</div>
				)}
			</div>
		);
	},
);

export default TagInput;