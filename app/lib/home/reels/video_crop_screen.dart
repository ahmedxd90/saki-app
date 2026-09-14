import 'package:flutter/material.dart';

class CropScreen extends StatelessWidget {
  const CropScreen({Key? key, this.controller}) : super(key: key);
  final Object? controller;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Crop video')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Done'),
        ),
      ),
    );
  }
}
