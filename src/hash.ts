// sample async function
export const getSHA256Hash = async (input: string) => {
	const textAsBuffer = new TextEncoder().encode(input);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");
};
