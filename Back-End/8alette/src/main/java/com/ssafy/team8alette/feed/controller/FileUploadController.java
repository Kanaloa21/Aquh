package com.ssafy.team8alette.feed.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class FileUploadController {

	private final AmazonS3Client amazonS3Client;

	@Value("${spring.data.couchbase.bucket-name}")
	private String bucket;

	@PostMapping
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			String fileName = file.getOriginalFilename();
			String fileUrl = "https://" + bucket + "/test" + fileName;
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType(file.getContentType());
			metadata.setContentLength(file.getSize());
			amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
			return ResponseEntity.ok(fileUrl);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
